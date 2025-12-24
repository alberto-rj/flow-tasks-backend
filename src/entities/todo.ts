export interface Todo {
  text: string;
  order: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
