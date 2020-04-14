export interface TemplatesMap {
  [name: string]: string;
}

export enum EmailTemplate {
  EmailRoot = 'EmailRoot',
  EmailSubjectPaymentWait = 'EmailSubjectPaymentWait',
  EmailSubjectPaymentCompleted = 'EmailSubjectPaymentCompleted',
  EmailSubjectShipped = 'EmailSubjectShipped',
  EmailSubjectReadyForPickup = 'EmailSubjectReadyForPickup',
  EmailSubjectCompleted = 'EmailSubjectCompleted',
  EmailSubjectCanceled = 'EmailSubjectCanceled',
  EmailMessagePaymentWait = 'EmailMessagePaymentWait',
  EmailMessagePaymentCompleted = 'EmailMessagePaymentCompleted',
  EmailMessageShipped = 'EmailMessageShipped',
  EmailMessageReadyForPickup = 'EmailMessageReadyForPickup',
  EmailMessageCompleted = 'EmailMessageCompleted',
  EmailMessageCanceled = 'EmailMessageCanceled'
}
