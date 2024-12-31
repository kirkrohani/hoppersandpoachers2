import { Injectable } from '@nestjs/common';
import { CreateMetaOptionsDTO } from '../dtos/create-post-meta-options.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {
  /**
   * @constructor
   * @param metaOptionRepo
   */
  constructor(
    /**
     * Injecting metaOptions repository
     */
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**
   * Method to CREATE A META OPTIONS object in meta_options db table
   * @param createMetaOptionDTO
   * @returns newly created MetaOption object
   */
  public async createMetaOption(createPostMetaOptionDTO: CreateMetaOptionsDTO) {
    const metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionDTO,
    );
    return await this.metaOptionsRepository.save(metaOption);
  }
}
