import { Injectable } from '@nestjs/common';
import { PaginationQueryDTO } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  constructor() {}

  async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDTO,
    repository: Repository<T>,
  ) {
    const items = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });
    return items;
  }
}
