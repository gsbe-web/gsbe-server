import { Inject, Injectable, Logger } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import { GoogleDriveConfigOptions, UploadedFile } from './types';
import { Readable } from 'stream';

/**
 * Service for interacting with Google Drive using the Google Drive API.
 * Provides methods for listing, uploading, creating folders, retrieving, renaming/moving, updating, and deleting files/folders.
 *
 * Example usage (in a NestJS controller):
 *
 *   constructor(private readonly googleDriveService: GoogleDriveService) {}
 *
 *   // List files in a folder
 *   const files = await this.googleDriveService.listFilesInFolder('folderId');
 *
 *   // Upload a file
 *   const uploaded = await this.googleDriveService.uploadFile(file, 'folderId');
 *
 *   // Create a folder
 *   const folderId = await this.googleDriveService.createFolder('New Folder', 'parentFolderId');
 *
 *   // Get file metadata
 *   const file = await this.googleDriveService.getFile('fileId');
 *
 *   // Rename or move a file
 *   const updated = await this.googleDriveService.renameOrMoveFile('fileId', 'newName', 'newFolderId');
 *
 *   // Update file content
 *   const updatedFile = await this.googleDriveService.updateFileContent('fileId', file);
 *
 *   // Delete a file
 *   await this.googleDriveService.deleteFile('fileId');
 */
@Injectable()
export class GoogleDriveService {
  constructor(
    @Inject('GOOGLE_DRIVE_CONFIG') private config: GoogleDriveConfigOptions,
  ) {}
  private logger: Logger = new Logger(GoogleDriveService.name);

  private get driveClient() {
    const configData = this.config.config;
    const auth = new google.auth.GoogleAuth({
      credentials: {
        ...configData,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const driveClient = google.drive({ version: 'v3', auth });
    return driveClient;
  }

  private bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  /**
   * Lists files in a specific Google Drive folder.
   * @param folderId Optional. The ID of the folder to list files from. Defaults to config value.
   * @returns Array of file metadata objects.
   *
   * @example
   *   const files = await service.listFilesInFolder('folderId');
   */
  async listFilesInFolder(folderId?: string): Promise<drive_v3.Schema$File[]> {
    const folder = folderId ?? this.config.folderId;
    try {
      const res = await this.driveClient.files.list({
        q: `'${folder}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
      });

      return res.data.files;
    } catch (error) {
      this.logger.error(error);
      throw new Error(
        `Error getting file ${folder} on Google Drive: ${error.message}`,
      );
    }
  }

  /**
   * Lists up to 10 files in the user's Google Drive.
   * @returns Array of file metadata objects.
   *
   * @example
   *   const files = await service.listFiles();
   */
  async listFiles(): Promise<drive_v3.Schema$File[]> {
    try {
      const response = await this.driveClient.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      });

      const files = response.data.files;
      return files;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error listing files in Google Drive: ${error.message}`);
    }
  }

  /**
   * Uploads a file to Google Drive, optionally to a specific folder.
   * @param file The file object (from Multer).
   * @param folderId Optional. The ID of the folder to upload to. Defaults to config value.
   * @returns UploadedFile object with fileId and URL.
   *
   * @example
   *   const uploaded = await service.uploadFile(file, 'folderId');
   */
  async uploadFile(
    file: Express.Multer.File,
    folderId?: string,
  ): Promise<UploadedFile> {
    try {
      const folder = folderId ?? this.config.folderId ?? null;
      const { originalname, buffer, mimetype } = file;
      const driveResponse = await this.driveClient.files.create({
        requestBody: {
          name: originalname,
          mimeType: mimetype,
          parents: folder ? [folder] : [],
        },
        media: {
          mimeType: mimetype,
          body: this.bufferToStream(buffer),
        },
        fields: 'id',
      });

      const fileId = driveResponse.data.id;
      const url = `https://drive.google.com/file/d/${fileId}/view`;

      return { fileId, url };
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error uploading file to Google Drive: ${error.message}`);
    }
  }

  /**
   * Creates a new folder in Google Drive.
   * @param name The name of the new folder.
   * @param parentFolderId Optional. The ID of the parent folder. Defaults to config value.
   * @returns The ID of the created folder.
   *
   * @example
   *   const folderId = await service.createFolder('New Folder', 'parentFolderId');
   */
  async createFolder(name: string, parentFolderId?: string): Promise<string> {
    const parentFolder = parentFolderId ?? this.config.folderId ?? null;
    try {
      const res = await this.driveClient.files.create({
        requestBody: {
          name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: parentFolder ? [parentFolder] : [],
        },
      });

      return res.data.id;
    } catch (error) {
      this.logger.error(error);
      throw new Error(
        `Error creating folder on Google Drive: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves metadata for a file by its ID.
   * @param fileId The ID of the file.
   * @returns File metadata object.
   *
   * @example
   *   const file = await service.getFile('fileId');
   */
  async getFile(fileId: string): Promise<drive_v3.Schema$File> {
    try {
      const res = await this.driveClient.files.get({
        fileId,
        fields: 'id, name, mimeType, parents, createdTime',
      });

      return res.data;
    } catch (error) {
      this.logger.error(error);
      throw new Error(
        `Error getting file ${fileId} on Google Drive: ${error.message}`,
      );
    }
  }

  /**
   * Renames or moves a file to a new folder.
   * @param fileId The ID of the file.
   * @param newName The new name for the file.
   * @param newFolderId Optional. The ID of the new parent folder.
   * @returns Updated file metadata object.
   *
   * @example
   *   const updated = await service.renameOrMoveFile('fileId', 'newName', 'newFolderId');
   */
  async renameOrMoveFile(
    fileId: string,
    newName: string,
    newFolderId?: string,
  ): Promise<drive_v3.Schema$File> {
    try {
      const updateBody: drive_v3.Schema$File = {
        name: newName,
        ...(newFolderId && { parents: [newFolderId] }),
      };

      const res = await this.driveClient.files.update({
        fileId,
        requestBody: updateBody,
      });

      return res.data;
    } catch (error) {
      this.logger.error(error);
      throw new Error(
        `Failed to move Google Drive file ${fileId} of name ${newName}`,
      );
    }
  }

  /**
   * Updates the content of an existing file.
   * @param fileId The ID of the file to update.
   * @param file The new file content (from Multer).
   * @returns Updated file metadata object.
   *
   * @example
   *   const updatedFile = await service.updateFileContent('fileId', file);
   */
  async updateFileContent(
    fileId: string,
    file: Express.Multer.File,
  ): Promise<drive_v3.Schema$File> {
    try {
      const res = await this.driveClient.files.update({
        fileId,
        media: {
          mimeType: file.mimetype,
          body: this.bufferToStream(file.buffer),
        },
      });

      return res.data;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to update Google Drive file ${fileId}`);
    }
  }

  /**
   * Deletes a file from Google Drive.
   * @param fileId The ID of the file to delete.
   * @returns void
   *
   * @example
   *   await service.deleteFile('fileId');
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.driveClient.files.delete({
        fileId,
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to delete Google Drive file ${fileId}`);
    }
  }
}
