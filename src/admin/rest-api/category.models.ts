export interface AdminCategoryWriteRequestBody {
  content: string;
  isHidden: boolean;
  isNotClickable: boolean;
  isWithoutProducts: boolean;
  name: string;
  parentId: number;
}
