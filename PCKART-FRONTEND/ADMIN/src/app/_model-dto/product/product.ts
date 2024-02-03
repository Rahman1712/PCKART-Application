import { Brand } from "../brand/brand"
import { Category } from "../category/category"

export class Product{
  id: number;
  name: string; 
  brand: Brand;
  price: number;
  quantity: number;
  discount: number;
  category: Category;
  color: string;
  description: string;
  specs: any;
  added_at: any;
  active: boolean;
}