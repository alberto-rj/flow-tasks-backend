import { randomUUID } from 'node:crypto';

import type {
  TodoCreateDto,
  TodoDeleteByIdDto,
  TodoDeleteManyByUserIdDto,
  TodoFilterDto,
  TodoFindByIdDto,
  TodoFindByUserIdWithOrderDto,
  TodoFindManyByUserIdDto,
  TodoOrderDto,
  TodoQueryDto,
  TodoSortByDto,
  TodoToggleByIdDto,
  TodoUpdateByIdDto,
  TodoReorderByIdDto,
  TodoGetStatsByUserIdDto,
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

  async findByUserIdWithOrder({ userId, order }: TodoFindByUserIdWithOrderDto) {
    for (const [, item] of this.items) {
      if (item.userId === userId && item.order === order) {
        return item;
      }
    }

    return null;
  }

  async findManyByUserId({
    userId,
    query,
    filter = 'all',
    sortBy = 'order',
    order = 'asc',
  }: TodoFindManyByUserIdDto) {
    const userItems = this.getItemsByUserId(userId);
    const queryItems = this.queryItems({
      items: userItems,
      query,
    });
    const filteredItems = this.filterItems({
      items: queryItems,
      filter,
    });
    const sortedItems = this.sortItems({
      items: filteredItems,
      sortBy,
      order,
    });

    return sortedItems;
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
    filter = 'completed',
  }: TodoDeleteManyByUserIdDto) {
    const userItems = this.getItemsByUserId(userId);

    this.filterItems({
      items: userItems,
      filter,
    }).forEach((item) => this.items.delete(item.id));
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

  async toggleById({ id, userId }: TodoToggleByIdDto) {
    const item = this.items.get(id);

    const isExistingItem =
      typeof item !== 'undefined' && item.userId === userId;

    if (!isExistingItem) {
      return null;
    }

    let newItem: Todo;
    const { completedAt, ...itemProps } = item;

    if (typeof completedAt === 'undefined') {
      newItem = {
        ...itemProps,
        completedAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      newItem = {
        ...itemProps,
        updatedAt: new Date(),
      };
    }

    this.items.set(id, newItem);

    return newItem;
  }

  async reorderById({ id, order, userId }: TodoReorderByIdDto) {
    const item = this.items.get(id);
    const isExistingItem = item && item.userId === userId;

    if (!isExistingItem) {
      return null;
    }

    const newItem: Todo = {
      ...item,
      order,
      updatedAt: new Date(),
    };

    this.items.set(id, newItem);

    return newItem;
  }

  async getStats({ userId }: TodoGetStatsByUserIdDto) {
    const userItems = this.getItemsByUserId(userId);

    const active = userItems.filter(
      (item) => typeof item.completedAt === 'undefined',
    ).length;
    const total = userItems.length;
    const completed = total - active;

    return {
      total,
      active,
      completed,
    };
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

  private queryItems({
    items,
    query,
  }: {
    items: Todo[];
    query: TodoQueryDto;
  }): Todo[] {
    if (typeof query === 'undefined') {
      return items;
    }
    const regex = new RegExp(`${query}`, 'im');
    return items.filter((item) => regex.test(item.title));
  }

  private filterItems({
    items,
    filter,
  }: {
    items: Todo[];
    filter: TodoFilterDto;
  }): Todo[] {
    if (filter === 'active') {
      return this.getActiveItemsByUserId(items);
    } else if (filter === 'completed') {
      return this.getCompletedItemsByUserId(items);
    }
    return items;
  }

  private getActiveItemsByUserId(items: Todo[]) {
    return items.filter((item) => !item.completedAt);
  }

  private getCompletedItemsByUserId(items: Todo[]) {
    return items.filter((item) => item.completedAt);
  }

  private sortItems({
    items,
    sortBy,
    order,
  }: {
    items: Todo[];
    sortBy: TodoSortByDto;
    order: TodoOrderDto;
  }): Todo[] {
    if (sortBy === 'createdAt') {
      return this.sortItemsByCreatedAt({ items, order });
    } else if (sortBy === 'updatedAt') {
      return this.sortItemsByUpdatedAt({ items, order });
    } else if (sortBy === 'order') {
      return this.sortItemsByOrder({ items, order });
    }
    return this.sortItemsByTitle({ items, order });
  }

  private sortItemsByTitle({
    items,
    order,
  }: {
    items: Todo[];
    order: TodoOrderDto;
  }) {
    if (order === 'desc') {
      return items.sort((a, b) => this.compareTitle.bind(this)(b, a));
    }
    return items.sort(this.compareTitle.bind(this));
  }

  private sortItemsByOrder({
    items,
    order,
  }: {
    items: Todo[];
    order: TodoOrderDto;
  }) {
    if (order === 'desc') {
      return items.sort((a, b) => this.compareOrder.bind(this)(b, a));
    }
    return items.sort(this.compareOrder.bind(this));
  }

  private sortItemsByUpdatedAt({
    items,
    order,
  }: {
    items: Todo[];
    order: TodoOrderDto;
  }) {
    if (order === 'desc') {
      return items.sort((a, b) => this.compareUpdatedAt.bind(this)(b, a));
    }
    return items.sort(this.compareUpdatedAt.bind(this));
  }

  private sortItemsByCreatedAt({
    items,
    order,
  }: {
    items: Todo[];
    order: TodoOrderDto;
  }) {
    if (order === 'desc') {
      return items.sort((a, b) => this.compareCreatedAt.bind(this)(b, a));
    }
    return items.sort(this.compareCreatedAt.bind(this));
  }

  private compareTitle(a: Todo, b: Todo) {
    const collator = new Intl.Collator('en-US', {
      sensitivity: 'base',
      ignorePunctuation: true,
    });
    return collator.compare(a.title, b.title);
  }

  private compareOrder(a: Todo, b: Todo) {
    return a.order - b.order;
  }

  private compareCreatedAt(a: Todo, b: Todo) {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  private compareUpdatedAt(a: Todo, b: Todo) {
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  }
}
