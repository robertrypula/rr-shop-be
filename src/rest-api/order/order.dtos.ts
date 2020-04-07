// tslint:disable:max-classes-per-file

import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderCreateRequestOrderItemsDto {
  public priceUnitOriginal: number;
  public priceUnitSelling: number;
  public productId: number;

  @IsNumber()
  public quantity: number;
}

export class OrderCreateRequestPromoCodeDto {
  public name: string;
  public percentageDiscount: number;
}

export class OrderCreateRequestDto {
  public orderItems: OrderCreateRequestOrderItemsDto[];
  // ---
  public email: string;
  public phone: string;
  public name: string;
  public surname: string;
  public address: string;
  public zipCode: string;
  @IsNotEmpty()
  public city: string;
  public comments: string;
  public parcelLocker: string;
  // ---
  public promoCode: OrderCreateRequestPromoCodeDto;
  // ---
  @IsNumber()
  public priceTotalOriginalAll: number;
  public priceTotalOriginalDelivery: number;
  public priceTotalOriginalPayment: number;
  public priceTotalOriginalProduct: number;
  public priceTotalSellingAll: number;
  public priceTotalSellingDelivery: number;
  public priceTotalSellingPayment: number;
  public priceTotalSellingProduct: number;
}
