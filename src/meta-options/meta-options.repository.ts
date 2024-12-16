import { EntityRepository, Repository } from 'typeorm';
import { MetaOption } from './meta-option.entity';
import { Logger } from '@nestjs/common';
import { CreateMetaOptionsDTO } from './dtos/create-post-meta-options.dto';

@EntityRepository(MetaOption)
export class MetaOptionsRepository extends Repository<MetaOption> {
  private logger = new Logger('MetaOptionsRepository', { timestamp: true });

  /**
   * Create Meta Options in DB
   * @param createMetaOptionsDto
   * @returns Promise<MetaOption>
   */
  async createMetaOptions(
    createPostMetaOptionsDto: CreateMetaOptionsDTO,
  ): Promise<MetaOption> {
    const metaOption = this.create(createPostMetaOptionsDto);
    return await this.save(metaOption);
  }
}
