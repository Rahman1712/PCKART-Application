export interface CategoryHierarchy<T>{
  parent: T;
  children: CategoryHierarchy<T>[];
}