export default interface ISubCategory {
  id?: string;
  name: string;
  category: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  active: Boolean;
}
