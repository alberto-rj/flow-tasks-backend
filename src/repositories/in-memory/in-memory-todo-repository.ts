import { randomUUID } from 'node:crypto';

import type {
  TodoCompleteByIdDto,
  TodoCreateDto,
  TodoDeleteByIdDto,
  TodoDeleteManyByUserIdDto,
  TodoFindByIdDto,
  TodoFindManyByUserIdDto,
  TodoUpdateByIdDto,
  TodoUpdateManyByUserIdDto,
} from '@/dtos/todo';
import type { Todo } from '@/entities';
import type { TodoRepository } from '@/repositories';
import { numKeys } from 'node_modules/zod/v4/core/util.cjs';

export class InMemoryTodoRepository implements TodoRepository {
  private items: Map<string, Todo> = new Map();

  async create({ title, userId }: TodoCreateDto): Promise<Todo> {
    const maxOrder = this.getMaxOrder();
    const order = maxOrder === null ? 0 : maxOrder + 1;
    const newItem: Todo = {
      title,
      userId,
      id: randomUUID(),
      order,
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
    const userItems = this.getItemsByUserId(userId);

    if (filter === 'active') {
      return userItems.filter(
        (item) =>
          item.userId === userId && typeof item.completedAt !== 'undefined',
      );
    } else if (filter === 'completed') {
      return userItems.filter(
        (item) => typeof item.completedAt === 'undefined',
      );
    }

    return userItems;
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
    const userItems = this.getItemsByUserId(userId);
    let itemsToDelete: Todo[] = [];

    if (filter === 'active') {
      itemsToDelete = userItems.filter(
        (item) => typeof item.completedAt === 'undefined',
      );
    } else if (filter === 'completed') {
      itemsToDelete = userItems.filter(
        (item) => typeof item.completedAt !== 'undefined',
      );
    } else {
      itemsToDelete = userItems;
    }

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

  private getMaxOrder(): number | null {
    let orders: number[] = [];

    for (const [, a] of this.items) {
      orders.push(a.order);
    }

    orders.sort((a, b) => b - a);

    const [max] = orders;

    if (typeof max == 'undefined') {
      return null;
    }

    return max;
  }

  private filterItems(): Todo[] {}
}
