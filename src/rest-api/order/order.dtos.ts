// tslint:disable:max-classes-per-file

import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import {
  DISCOUNT_PERCENTAGE_MAX,
  ORDER_DELIVERY_PLUS_PAYMENT_SIZE,
  ORDER_PRODUCTS_SIZE_MAX,
  ORDER_PRODUCTS_SIZE_MIN
} from '../../config';
import {
  EMAIL_LENGTH,
  GENERIC_FORM_LENGTH,
  PARCEL_LOCKER_LENGTH,
  PHONE_LENGTH,
  PROMO_CODE_LENGTH,
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
  @Max(DISCOUNT_PERCENTAGE_MAX)
  public percentageDiscount: number;
}

export class OrderCreateRequestDto {
  @Expose()
  @Type(() => OrderCreateRequestOrderItemDto)
  @ValidateNested()
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(ORDER_DELIVERY_PLUS_PAYMENT_SIZE + ORDER_PRODUCTS_SIZE_MIN)
  @ArrayMaxSize(ORDER_DELIVERY_PLUS_PAYMENT_SIZE + ORDER_PRODUCTS_SIZE_MAX)
  public orderItems: OrderCreateRequestOrderItemDto[];

  // ---

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(EMAIL_LENGTH)
  public email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(PHONE_LENGTH)
  public phone: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  public name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  public surname: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  public address: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(ZIP_CODE_LENGTH)
  public zipCode: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(GENERIC_FORM_LENGTH)
  public city: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_AREA_LENGTH)
  public comments: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(PARCEL_LOCKER_LENGTH)
  public parcelLocker: string;

  // ---

  @Expose()
  @Type(() => OrderCreateRequestPromoCodeDto)
  @ValidateNested()
  @IsOptional()
  @IsObject()
  public promoCode: OrderCreateRequestPromoCodeDto;

  // ---

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public priceTotalOriginalAll: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public priceTotalOriginalDelivery: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public priceTotalOriginalPayment: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public priceTotalOriginalProduct: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public priceTotalSellingAll: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public priceTotalSellingDelivery: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public priceTotalSellingPayment: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public priceTotalSellingProduct: number;
}
