import { Injectable } from '@nestjs/common';
import { CreateMetaOptionsDTO } from '../dtos/create-post-meta-options.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { MetaOptionsRepository } from '../meta-options.repository';

@Injectable()
export class MetaOptionsService {
  /**
   * @constructor
   * @param metaOptionRepo
   */
  constructor(
    // Inject MetaOption Repo
    @InjectRepository(MetaOptionsRepository)
    private metaOptionRepo: MetaOptionsRepository,
  ) {}

  /**
   * Method to CREATE A META OPTIONS object in meta_options db table
   * @param createMetaOptionDTO
   * @returns newly created MetaOption object
   */
  public async createMetaOption(createPostMetaOptionDTO: CreateMetaOptionsDTO) {
    return await this.metaOptionRepo.createMetaOptions(createPostMetaOptionDTO);
  }
}
