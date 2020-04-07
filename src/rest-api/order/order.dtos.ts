// tslint:disable:max-classes-per-file

import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, ValidateNested } from 'class-validator';

// https://wanago.io/2018/12/17/typescript-express-error-handling-validation/

export class OrderCreateRequestOrderItemDto {
  @Expose()
  public priceUnitOriginal: number;

  @Expose()
  public priceUnitSelling: number;

  @Expose()
  public productId: number;

  @Expose()
  // @IsNumber()
  // @IsPositive()
  @IsNotEmpty()
  @Max(2)
  public quantity: number;
}

export class OrderCreateRequestPromoCodeDto {
  @Expose()
  public name: string;

  @Expose()
  public percentageDiscount: number;
}

export class OrderCreateRequestDto {
  @ValidateNested()
  @Expose()
  @Type(() => OrderCreateRequestOrderItemDto)
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
