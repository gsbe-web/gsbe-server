import { ApiResponseProperty } from '@nestjs/swagger';

export class ChargeResponseDataDto {
  @ApiResponseProperty({ example: '9p7tliqqe8npl4q' })
  reference: string;

  @ApiResponseProperty({ example: 'pay_offline' })
  status: string;

  @ApiResponseProperty({
    example:
      'Please complete the authorisation process by inputting your PIN on your mobile device',
  })
  display_text: string;
}

export class ChargeResponseDto {
  @ApiResponseProperty({ example: true })
  status: boolean;

  @ApiResponseProperty({ example: 'Charge attempted' })
  message: string;

  @ApiResponseProperty({ type: ChargeResponseDataDto })
  data: ChargeResponseDataDto;
}

export class InitializeResponseDataDto {
  @ApiResponseProperty({
    example: 'https://checkout.paystack.com/nkdks46nymizns7',
  })
  authorization_url: string;

  @ApiResponseProperty({ example: 'nkdks46nymizns7' })
  access_code: string;

  @ApiResponseProperty({ example: 'nms6uvr1pl' })
  reference: string;
}

export class InitializeResponseDto {
  @ApiResponseProperty({ example: true })
  status: boolean;

  @ApiResponseProperty({ example: 'Charge attempted' })
  message: string;

  @ApiResponseProperty({ type: ChargeResponseDataDto })
  data: InitializeResponseDataDto;
}
