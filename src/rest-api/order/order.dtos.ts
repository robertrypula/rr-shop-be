// tslint:disable:max-classes-per-file

import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsAlpha,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateNested
} from 'class-validator';

// https://wanago.io/2018/12/17/typescript-express-error-handling-validation/

export class OrderCreateRequestOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Expose()
  public priceUnitOriginal: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Expose()
  public priceUnitSelling: number;

  @IsNotEmpty()
  @IsPositive()
  @Expose()
  public productId: number;

  @IsNotEmpty()
  @IsPositive()
  @Expose()
  public quantity: number;
}

export class OrderCreateRequestPromoCodeDto {
  @Expose()
  public name: string;

  @Expose()
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
  public email: string;

  @Expose()
  public phone: string;

  @Expose()
  public name: string;

  @Expose()
  public surname: string;

  @Expose()
  public address: string;

  @Expose()
  public zipCode: string;

  @Expose()
  @IsNotEmpty()
  public city: string;

  @Expose()
  public comments: string;

  @Expose()
  public parcelLocker: string;

  // ---

  @ValidateNested()
  @IsOptional()
  @Expose()
  @Type(() => OrderCreateRequestPromoCodeDto)
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
