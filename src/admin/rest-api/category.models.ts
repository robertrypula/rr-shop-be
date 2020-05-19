export interface AdminCategoryWriteRequestBody {
  content: string;
  contentShort: string;
  isHidden: boolean;
  isHiddenListOfProducts: boolean;
  isNotClickable: boolean;
  isVisibleListOfCategories: boolean;
  linkId: number;
  linkOpenInNewTab: boolean;
  linkText: string;
  name: string;
  parentId: number;
  sortOrder: number;
}
