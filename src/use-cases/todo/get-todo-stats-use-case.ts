import type { TodoGetStatsByUserIdDto } from '@/dtos/todo';
import type { TodoStats } from '@/entities';
import type { TodoRepository } from '@/repositories';

export interface GetTodoStatsUseCaseParams {
  data: TodoGetStatsByUserIdDto;
}

export interface GetTodoStatsUseCaseResult {
  stats: TodoStats;
}

export class GetTodoStatsUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    data,
  }: GetTodoStatsUseCaseParams): Promise<GetTodoStatsUseCaseResult> {
    const stats = await this.todoRepository.getStats(data);

    return {
      stats,
    };
  }
}
