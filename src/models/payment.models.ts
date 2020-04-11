export enum Status {
  Canceled = 'Canceled',
  Completed = 'Completed',
  Pending = 'Pending'
}

export interface PayUOrder {
  orderId: string;
  redirectUri: string;
}
