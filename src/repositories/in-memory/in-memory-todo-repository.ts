import type {
  TodoCreateParams,
  Todo,
  TodoUpdateParams,
  TodoUpdateOrdersParams,
} from '@/schemas/todo';
import type { TodosRepository } from '../todos-repository';
import { randomUUID } from 'crypto';

class InMemoryTodoRepository implements TodosRepository {
  private items: Todo[];

  constructor() {
    this.items = [];
  }

  async create({ title, order, userId }: TodoCreateParams): Promise<Todo> {
    const newItem: Todo = {
      title,
      order,
      userId,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.items.push(newItem);

    return newItem;
  }

  async findManyByUserId(userId: string) {
    const items = this.items.filter((item) => item.userId === userId);

    return items;
  }

  async deleteById(id: string) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index < 0) {
      return null;
    }

    const reminderItems = this.items.filter((item) => item.id !== id);

    const item = this.items[index] as Todo;

    this.items = reminderItems;

    return item;
  }

  async deleteManyCompleted() {
    const foundItems = this.items.filter(
      (item) => typeof item.completedAt === 'undefined',
    );

    this.items = [...foundItems];
  }

  async updateById(data: TodoUpdateParams, id: string): Promise<void> {}

  async updateMany({ todos }: TodoUpdateOrdersParams, id: string) {}
}
