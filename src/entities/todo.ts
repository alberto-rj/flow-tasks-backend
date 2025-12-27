export interface Todo {
  id: string;
  title: string;
  order: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
