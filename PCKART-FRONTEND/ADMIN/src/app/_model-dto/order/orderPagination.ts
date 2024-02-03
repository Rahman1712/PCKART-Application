import { Order } from "./order";

export class OrderPagination{
  totalItems: number;
  listOrders: Order[];
  totalPages: number;
  sortField: string;
  reverseSortDir: string;
  pageNum: number;
  sortDir: string;
  limit: number;
  startCount: number;
  endCount: number;
}