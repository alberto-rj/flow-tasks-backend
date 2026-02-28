import { eq, and, asc, isNotNull, isNull, desc, ilike, sql } from 'drizzle-orm';

import { load } from '@/config/env';
import { db } from '@/drizzle';
import { todos } from '@/drizzle/schemas';
import type {
  TodoCreateDto,
  TodoDeleteByIdDto,
  TodoDeleteManyByUserIdDto,
  TodoFindByIdDto,
  TodoFindByUserIdWithOrderDto,
  TodoFindManyByUserIdDto,
  TodoToggleByIdDto,
  TodoUpdateByIdDto,
  TodoReorderByIdDto,
  TodoGetStatsByUserIdDto,
} from '@/dtos/todo';
import type { Todo } from '@/entities';
import type { TodoRepository } from '@/repositories';

const { NODE_ENV } = load();

export class PgTodoRepository implements TodoRepository {
  async create({ title, userId }: TodoCreateDto): Promise<Todo> {
    const createdTodos = await db
      .insert(todos)
      .values({ title, userId })
      .returning();

    const [createdTodo] = createdTodos.map(PgTodoRepository.toTodo);

    return createdTodo as Todo;
  }

  async findById({ todoId, userId }: TodoFindByIdDto) {
    const [foundTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.todoId, todoId), eq(todos.userId, userId)));

    if (!foundTodo) {
      return null;
    }

    const { completedAt, ...todoProps } = foundTodo;

    if (completedAt == null) {
      return todoProps;
    }

    return foundTodo;
  }

  async findByUserIdWithOrder({ userId, order }: TodoFindByUserIdWithOrderDto) {
    const [foundTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.userId, userId), eq(todos.order, order)));

    if (!foundTodo) {
      return null;
    }

    const { completedAt, ...todoProps } = foundTodo;

    if (completedAt == null) {
      return todoProps;
    }

    return foundTodo;
  }

  async findManyByUserId({
    userId,
    query,
    filter = 'all',
    sortBy = 'order',
    order = 'asc',
  }: TodoFindManyByUserIdDto) {
    const baseCondition = eq(todos.userId, userId);

    let condition;
    if (typeof query === 'string') {
      condition = and(baseCondition, ilike(todos.title, `%${query}%`));
    } else {
      condition = baseCondition;
    }

    const filterConditions = {
      all: condition,
      active: and(condition, isNull(todos.completedAt)),
      completed: and(condition, isNotNull(todos.completedAt)),
    } as const;

    const orderByClause = {
      asc: asc(todos[sortBy]),
      desc: desc(todos[sortBy]),
    } as const;

    const foundTodos = await db
      .select()
      .from(todos)
      .where(filterConditions[filter])
      .orderBy(orderByClause[order]);

    return foundTodos.map(PgTodoRepository.toTodo);
  }

  async deleteById({ todoId, userId }: TodoDeleteByIdDto) {
    const [deletedTodo] = await db
      .delete(todos)
      .where(and(eq(todos.todoId, todoId), eq(todos.userId, userId)))
      .returning();

    if (!deletedTodo) {
      return null;
    }

    return PgTodoRepository.toTodo(deletedTodo);
  }

  async deleteManyByUserId({
    userId,
    filter = 'completed',
  }: TodoDeleteManyByUserIdDto) {
    const baseCondition = eq(todos.userId, userId);

    const filterConditions = {
      all: baseCondition,
      active: and(baseCondition, isNull(todos.completedAt)),
      completed: and(baseCondition, isNotNull(todos.completedAt)),
    } as const;

    const condition = filterConditions[filter];

    await db.delete(todos).where(condition);
  }

  async updateById({ todoId, title, order, userId }: TodoUpdateByIdDto) {
    const [updatedTodo] = await db
      .update(todos)
      .set({ title, order })
      .where(and(eq(todos.todoId, todoId), eq(todos.userId, userId)))
      .returning();

    if (!updatedTodo) {
      return null;
    }

    return updatedTodo as Todo;
  }

  async toggleById({ todoId, userId }: TodoToggleByIdDto) {
    const [updatedTodo] = await db
      .update(todos)
      .set({
        completedAt: sql`
          CASE 
            WHEN ${todos.completedAt} IS NULL THEN NOW() 
            ELSE NULL 
          END
          `,
      })
      .where(and(eq(todos.todoId, todoId), eq(todos.userId, userId)))
      .returning();

    if (!updatedTodo) {
      return null;
    }

    return PgTodoRepository.toTodo(updatedTodo);
  }

  async reorderById({ todoId, order, userId }: TodoReorderByIdDto) {
    const [updatedTodo] = await db
      .update(todos)
      .set({ order })
      .where(and(eq(todos.todoId, todoId), eq(todos.userId, userId)))
      .returning();

    if (!updatedTodo) {
      return null;
    }

    return PgTodoRepository.toTodo(updatedTodo);
  }

  async getStats({ userId }: TodoGetStatsByUserIdDto) {
    const [result] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        active: sql<number>`COUNT(*) FILTER (WHERE ${todos.completedAt} IS NULL)`,
        completed: sql<number>`COUNT(*) FILTER (WHERE ${todos.completedAt}) IS NOT NULL`,
      })
      .from(todos)
      .where(eq(todos.userId, userId));

    return {
      total: Number(result?.total || 0),
      active: Number(result?.active || 0),
      completed: Number(result?.completed || 0),
    };
  }

  async clear() {
    if (NODE_ENV !== 'test') {
      throw new Error(
        'Only clear the todos table in the test development mode.',
      );
    }
    await db.delete(todos);
  }

  private static toTodo({
    completedAt,
    ...todoProps
  }: {
    todoId: string;
    title: string;
    order: number;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }): Todo {
    if (completedAt === null) {
      return {
        ...todoProps,
      };
    }

    return {
      completedAt,
      ...todoProps,
    };
  }
}
