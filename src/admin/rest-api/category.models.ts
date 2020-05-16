export interface AdminCategoryWriteRequestBody {
  content: string;
  isHidden: boolean;
  isNotClickable: boolean;
  isHiddenListOfProducts: boolean;
  name: string;
  parentId: number;
}
