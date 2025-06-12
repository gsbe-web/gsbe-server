import { DynamicModule, Module, Provider } from '@nestjs/common';
import { GoogleDriveConfigOptions } from './types';
import { GoogleDriveService } from './google-drive.service';

@Module({})
export class GoogleDriveModule {
  static register(conf: GoogleDriveConfigOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'GOOGLE_DRIVE_CONFIG',
        useValue: conf,
      },
      GoogleDriveService,
    ];

    const moduleDef: DynamicModule = {
      module: GoogleDriveModule,
      providers,
      exports: [GoogleDriveService],
    };

    if (conf.options && conf.options.isGlobal) {
      return {
        global: true,
        ...moduleDef,
      };
    }

    return moduleDef;
  }

  static registerAsync(options: {
    useFactory: (
      ...args: any[]
    ) => Promise<GoogleDriveConfigOptions> | GoogleDriveConfigOptions;
    inject?: any[];
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'GOOGLE_DRIVE_CONFIG',
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      GoogleDriveService,
    ];

    return {
      module: GoogleDriveModule,
      providers,
      exports: [GoogleDriveService],
    };
  }
}
