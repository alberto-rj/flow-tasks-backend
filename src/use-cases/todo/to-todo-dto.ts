import type { TodoDto } from '@/dtos/todo';
import type { Todo } from '@/entities';

export function toTodoDto(todo: Todo): TodoDto {
  if (!todo.completedAt) {
    return {
      todoId: todo.todoId,
      title: todo.title,
      order: todo.order,
      userId: todo.userId,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }

  return {
    todoId: todo.todoId,
    title: todo.title,
    order: todo.order,
    userId: todo.userId,
    completedAt: todo.completedAt.toISOString(),
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}
