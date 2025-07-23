import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export type PaymentMethod = 'MTN' | 'Vodafone' | 'AirtelTigo' | 'CARD';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

class PaystackAuthorizationDto {
  @ApiProperty({
    description: 'Authorization code for the payment.',
    example: 'AUTH_08ki6d1xro',
  })
  @IsString()
  authorization_code: string;

  @ApiProperty({
    description:
      'Bank Identification Number (BIN) or phone prefix for mobile money.',
    example: '055XXX',
  })
  @IsString()
  bin: string;

  @ApiProperty({
    description: 'Last 4 digits of the card or masked phone number.',
    example: 'X987',
  })
  @IsString()
  last4: string;

  @ApiProperty({
    description: 'Card expiry month or mobile money expiry.',
    example: '12',
  })
  @IsString()
  exp_month: string;

  @ApiProperty({
    description: 'Card expiry year or mobile money expiry.',
    example: '9999',
  })
  @IsString()
  exp_year: string;

  @ApiProperty({
    description: 'Payment channel used.',
    enum: ['card', 'mobile_money'],
    example: 'mobile_money',
  })
  @IsString()
  channel: 'card' | 'mobile_money';

  @ApiPropertyOptional({
    description: 'Type of card used. Empty for mobile money.',
    example: '',
  })
  @IsString()
  @IsOptional()
  card_type: string;

  @ApiPropertyOptional({
    description: 'Bank name for mobile money.',
    enum: ['MTN', 'Vodafone', 'AirtelTigo'],
    example: 'MTN',
  })
  @IsString()
  @IsOptional()
  bank: 'MTN' | 'Vodafone' | 'AirtelTigo';

  @ApiPropertyOptional({
    description: 'Country code of the card or mobile money.',
    example: 'GH',
  })
  @IsString()
  @IsOptional()
  country_code: string;

  @ApiPropertyOptional({
    description: 'Brand of the card or mobile money.',
    enum: ['visa', 'mastercard', 'MTN', 'Vodafone', 'AirtelTigo', 'Mtn'],
    example: 'Mtn',
  })
  @IsString()
  @IsOptional()
  brand: 'visa' | 'mastercard' | 'MTN' | 'Vodafone' | 'AirtelTigo';

  @ApiProperty({
    description: 'Whether the authorization is reusable.',
    example: false,
  })
  @IsBoolean()
  reusable: boolean;

  @ApiPropertyOptional({
    description: 'Signature for the transaction.',
    example: null,
  })
  @IsString()
  @IsOptional()
  signature: string;

  @ApiPropertyOptional({
    description: 'Account name associated with the card or mobile money.',
    example: null,
  })
  @IsString()
  @IsOptional()
  account_name: string;

  @ApiPropertyOptional({
    description: 'Receiver bank account number (for transfers).',
    example: null,
  })
  @IsString()
  @IsOptional()
  receiver_bank_account_number?: string;

  @ApiPropertyOptional({
    description: 'Receiver bank name (for transfers).',
    example: null,
  })
  @IsString()
  @IsOptional()
  receiver_bank?: string;
}

class PaystackCustomerDto {
  @ApiProperty({
    description: 'Customer ID from Paystack.',
    example: 294359931,
  })
  @IsNumber()
  id: number;

  @ApiPropertyOptional({
    description: 'First name of the customer.',
    example: null,
  })
  @IsString()
  @IsOptional()
  first_name: string;

  @ApiPropertyOptional({
    description: 'Last name of the customer.',
    example: null,
  })
  @IsString()
  @IsOptional()
  last_name: string;

  @ApiProperty({
    description: 'Email address of the customer.',
    example: 'domeyeben4@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Customer code from Paystack.',
    example: 'CUS_7s700yhe1ljcegz',
  })
  @IsString()
  customer_code: string;

  @ApiPropertyOptional({
    description: 'Phone number of the customer.',
    example: null,
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    description: 'Custom metadata for the customer.',
    example: null,
  })
  @IsObject()
  @IsOptional()
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Risk action for the customer.',
    example: 'default',
  })
  @IsString()
  risk_action: string;

  @ApiPropertyOptional({
    description: 'International format phone number.',
    example: null,
  })
  @IsString()
  @IsOptional()
  international_format_phone: string;
}

class PaystackSourceDto {
  @ApiProperty({
    description: 'Type of source for the transaction.',
    example: 'api',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Source of the transaction.',
    example: 'merchant_api',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'Entry point for the transaction.',
    example: 'transaction_initialize',
  })
  @IsString()
  entry_point: string;

  @ApiPropertyOptional({
    description: 'Identifier for the source.',
    example: null,
  })
  @IsString()
  @IsOptional()
  identifier: string;
}

export class PaystackDataDto {
  @ApiProperty({
    description: 'Unique transaction ID from Paystack.',
    example: 5171264208,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Domain of the transaction.',
    enum: ['live', 'test'],
    example: 'test',
  })
  @IsString()
  domain: 'live' | 'test';

  @ApiProperty({
    description: 'Status of the transaction.',
    example: 'success',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Transaction reference code.',
    example: '0v2zzleht3',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Amount paid in kobo (for NGN) or pesewas (for GHS).',
    example: 20000,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Message from Paystack about the transaction.',
    example: null,
  })
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({
    description: 'Gateway response message.',
    example: 'Approved',
  })
  @IsString()
  gateway_response: string;

  @ApiProperty({
    description: 'Date and time payment was made (ISO string).',
    example: '2025-07-23T07:05:06.000Z',
  })
  @IsDateString()
  paid_at: string;

  @ApiProperty({
    description: 'Date and time transaction was created (ISO string).',
    example: '2025-07-23T07:04:53.000Z',
  })
  @IsDateString()
  created_at: string;

  @ApiProperty({
    description: 'Payment channel used (e.g., card, mobile_money).',
    example: 'mobile_money',
  })
  @IsString()
  channel: string;

  @ApiProperty({
    description: 'Currency of the transaction (e.g., NGN, GHS).',
    example: 'GHS',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'IP address of the payer.',
    example: '154.160.20.24',
  })
  @IsString()
  ip_address: string;

  @ApiPropertyOptional({
    description: 'Custom metadata sent with the transaction.',
    example: { paymentId: '68808991a2bfc54c7f47c837' },
  })
  @IsObject()
  @IsOptional()
  metadata: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Breakdown of transaction fees.',
    example: null,
  })
  @IsObject()
  @IsOptional()
  fees_breakdown: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Log details for the transaction.',
    example: null,
  })
  @IsObject()
  @IsOptional()
  log: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Total fees charged for the transaction.',
    example: 390,
  })
  @IsNumber()
  @IsOptional()
  fees: number;

  @ApiPropertyOptional({
    description: 'Details of fee split if applicable.',
    example: null,
  })
  @IsObject()
  @IsOptional()
  fees_split: Record<string, any>;

  @ApiProperty({
    type: PaystackAuthorizationDto,
    description: 'Authorization details for the payment.',
    example: {
      authorization_code: 'AUTH_08ki6d1xro',
      bin: '055XXX',
      last4: 'X987',
      exp_month: '12',
      exp_year: '9999',
      channel: 'mobile_money',
      card_type: '',
      bank: 'MTN',
      country_code: 'GH',
      brand: 'Mtn',
      reusable: false,
      signature: null,
      account_name: null,
      receiver_bank_account_number: null,
      receiver_bank: null,
    },
  })
  @IsObject()
  authorization: PaystackAuthorizationDto;

  @ApiProperty({
    type: PaystackCustomerDto,
    description: 'Customer details for the transaction.',
    example: {
      id: 294359931,
      first_name: null,
      last_name: null,
      email: 'domeyeben4@gmail.com',
      customer_code: 'CUS_7s700yhe1ljcegz',
      phone: null,
      metadata: null,
      risk_action: 'default',
      international_format_phone: null,
    },
  })
  @IsObject()
  customer: PaystackCustomerDto;

  @ApiPropertyOptional({
    description: 'Plan details if payment is for a subscription.',
    example: {},
  })
  @IsObject()
  @IsOptional()
  plan: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Subaccount details if payment is split.',
    example: {},
  })
  @IsObject()
  @IsOptional()
  subaccount: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Split details for the transaction.',
    example: {},
  })
  @IsObject()
  @IsOptional()
  split: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Order ID if available.',
    example: null,
  })
  @IsString()
  @IsOptional()
  order_id: string;

  @ApiPropertyOptional({
    description:
      'Date and time payment was made (alternate field, ISO string).',
    example: '2025-07-23T07:05:06.000Z',
  })
  @IsDateString()
  @IsOptional()
  paidAt: string;

  @ApiProperty({
    description: 'Requested amount for the transaction.',
    example: 20000,
  })
  @IsNumber()
  requested_amount: number;

  @ApiPropertyOptional({
    description: 'POS transaction data if payment was made via POS.',
    example: null,
  })
  @IsObject()
  @IsOptional()
  pos_transaction_data: Record<string, any>;

  @ApiProperty({
    type: PaystackSourceDto,
    description: 'Source details for the transaction.',
    example: {
      type: 'api',
      source: 'merchant_api',
      entry_point: 'transaction_initialize',
      identifier: null,
    },
  })
  @IsObject()
  source: PaystackSourceDto;
}

export class PaystackWebhookDto {
  @ApiProperty({
    enum: ['charge.success, transfer.success, transfer.failed, charge.failed'],
    example: 'transfer.success',
  })
  @IsString()
  event: PaystackWebhookEvent;

  @ApiProperty({
    type: PaystackDataDto,
  })
  @IsObject()
  data: PaystackDataDto;
}

export type PaystackWebhookEvent =
  | 'charge.success'
  | 'transfer.success'
  | 'transfer.failed'
  | 'charge.failed';
