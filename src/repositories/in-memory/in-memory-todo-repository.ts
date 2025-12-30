import { randomUUID } from 'node:crypto';

import type {
  TodoCompleteByIdDto,
  TodoCreateDto,
  TodoDeleteByIdDto,
  TodoDeleteManyByUserIdDto,
  TodoFilterDto,
  TodoFindByIdDto,
  TodoFindManyByUserIdDto,
  TodoUpdateByIdDto,
  TodoUpdateManyByUserIdDto,
} from '@/dtos/todo';
import type { Todo } from '@/entities';
import type { TodoRepository } from '@/repositories';

export class InMemoryTodoRepository implements TodoRepository {
  private items: Map<string, Todo> = new Map();

  async create({ title, userId }: TodoCreateDto): Promise<Todo> {
    const newItem: Todo = {
      title,
      userId,
      id: randomUUID(),
      order: this.getNexOrder(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.set(newItem.id, newItem);

    return newItem;
  }

  async findById({ id, userId }: TodoFindByIdDto) {
    const foundItem = this.items.get(id);

    if (typeof foundItem === 'undefined') {
      return null;
    }

    if (foundItem.userId !== userId) {
      return null;
    }

    return foundItem;
  }

  async findManyByUserId({ userId, filter = 'all' }: TodoFindManyByUserIdDto) {
    return this.filterItems({ filter, userId });
  }

  async deleteById({ id, userId }: TodoDeleteByIdDto) {
    const item = this.items.get(id);

    if (typeof item === 'undefined') {
      return null;
    }

    if (item.userId != userId) {
      return null;
    }

    this.items.delete(id);

    return item;
  }

  async deleteManyByUserId({
    userId,
    filter = 'active',
  }: TodoDeleteManyByUserIdDto) {
    let itemsToDelete: Todo[] = [];

    itemsToDelete = this.filterItems({ filter, userId });

    itemsToDelete.forEach((item) => this.items.delete(item.id));
  }

  async updateById({ id, title, order, userId }: TodoUpdateByIdDto) {
    const item = this.items.get(id);

    if (typeof item === 'undefined') {
      return null;
    }

    if (item.userId !== userId) {
      return null;
    }

    let newItem: Todo;

    if (typeof order === 'number') {
      newItem = {
        ...item,
        title,
        order,
        updatedAt: new Date(),
      };
    } else {
      newItem = { ...item, title, updatedAt: new Date() };
    }

    this.items.set(id, newItem);

    return newItem;
  }

  async completeById({ id, userId }: TodoCompleteByIdDto) {
    const item = this.items.get(id);

    const hasItemExists = typeof item !== 'undefined' && item.userId === userId;

    if (!hasItemExists) {
      return null;
    }

    const newItem: Todo = {
      ...item,
      completedAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.set(id, newItem);

    return newItem;
  }

  async updateManyByUserId({ todos, userId }: TodoUpdateManyByUserIdDto) {
    const itemsToUpdate: Map<string, Todo> = new Map();

    for (const todo of todos) {
      const foundItem = this.items.get(todo.id);
      if (!foundItem || foundItem.userId !== userId) {
        return null;
      }
      itemsToUpdate.set(todo.id, {
        ...foundItem,
        order: todo.order,
        updatedAt: new Date(),
      });
    }

    for (const [id, item] of itemsToUpdate) {
      this.items.set(id, item);
    }
  }

  private getItemsByUserId(userId: string) {
    const userItems: Todo[] = [];

    for (const [, item] of this.items) {
      if (item.userId === userId) {
        userItems.push(item);
      }
    }

    return userItems;
  }

  private getNexOrder(): number {
    let orders: number[] = [];

    for (const [, a] of this.items) {
      orders.push(a.order);
    }

    orders.sort((a, b) => b - a);

    const [max] = orders;

    if (typeof max === 'undefined') {
      return 0;
    }

    return max + 1;
  }

  private filterItems({
    filter,
    userId,
  }: {
    filter: TodoFilterDto;
    userId: string;
  }): Todo[] {
    if (filter === 'active') {
      return this.getActiveItemsByUserId(userId);
    } else if (filter === 'completed') {
      return this.getCompletedItemsByUserId(userId);
    }
    return this.getItemsByUserId(userId);
  }

  private getActiveItemsByUserId(userId: string) {
    const userItems = this.getItemsByUserId(userId);
    return userItems.filter((item) => !item.completedAt);
  }

  private getCompletedItemsByUserId(userId: string) {
    const userItems = this.getItemsByUserId(userId);
    return userItems.filter((item) => item.completedAt);
  }
}
