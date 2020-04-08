// tslint:disable:max-classes-per-file

import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber, IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import {
  EMAIL_LENGTH,
  GENERIC_FORM_LENGTH,
  PARCEL_LOCKER_LENGTH,
  PHONE_LENGTH, PROMO_CODE_LENGTH,
  TEXT_AREA_LENGTH,
  ZIP_CODE_LENGTH
} from '../../entity/length-config';

// https://wanago.io/2018/12/17/typescript-express-error-handling-validation/

export class OrderCreateRequestOrderItemDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public priceUnitOriginal: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public priceUnitSelling: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public productId: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public quantity: number;
}

export class OrderCreateRequestPromoCodeDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(PROMO_CODE_LENGTH)
  public name: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public percentageDiscount: number;
}

export class OrderCreateRequestDto {
  @Expose()
  @Type(() => OrderCreateRequestOrderItemDto)
  @ValidateNested()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(3)
  public orderItems: OrderCreateRequestOrderItemDto[];

  // ---

  @Expose()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(EMAIL_LENGTH)
  public email: string;

  @Expose()
  @IsString()
  @MaxLength(PHONE_LENGTH)
  @IsNotEmpty()
  public phone: string;

  @Expose()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public name: string;

  @Expose()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public surname: string;

  @Expose()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public address: string;

  @Expose()
  @IsString()
  @MaxLength(ZIP_CODE_LENGTH)
  @IsNotEmpty()
  public zipCode: string;

  @Expose()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  @IsNotEmpty()
  public city: string;

  @Expose()
  @IsString()
  @MaxLength(TEXT_AREA_LENGTH)
  @IsOptional()
  public comments: string;

  @Expose()
  @IsString()
  @MaxLength(PARCEL_LOCKER_LENGTH)
  @IsOptional()
  public parcelLocker: string;

  // ---

  @Expose()
  @Type(() => OrderCreateRequestPromoCodeDto)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  public promoCode: OrderCreateRequestPromoCodeDto;

  // ---

  @Expose()
  @IsNumber()
  public priceTotalOriginalAll: number;

  @Expose()
  public priceTotalOriginalDelivery: number;

  @Expose()
  public priceTotalOriginalPayment: number;

  @Expose()
  public priceTotalOriginalProduct: number;

  @Expose()
  public priceTotalSellingAll: number;

  @Expose()
  public priceTotalSellingDelivery: number;

  @Expose()
  public priceTotalSellingPayment: number;

  @Expose()
  public priceTotalSellingProduct: number;
}
