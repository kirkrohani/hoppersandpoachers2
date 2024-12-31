import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTagDTO } from '../dtos/create-tag.dto';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@Injectable()
export class TagsService {
  private logger = new Logger('TagsService', { timestamp: true });

  constructor(
    /**
     * Inject tagsRepository
     */
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  /**
   * Create Tag method, calls Tag Repository
   * @param createTagDto
   * @returns Promise<Tag>
   */
  async createTag(createTagDto: CreateTagDTO): Promise<Tag> {
    try {
      const tag = this.tagsRepository.create(createTagDto);
      this.tagsRepository.save(tag);
      return tag;
    } catch (error) {
      this.logger.error(
        `Error in createTag() saving tag to DB and create tag data: ${JSON.stringify(createTagDto)}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async findTags(tagIds: string[]): Promise<Tag[]> {
    try {
      const results = await this.tagsRepository.find({
        where: {
          id: In(tagIds),
        },
      });
      return results;
    } catch (error) {
      this.logger.error(
        `Error in findTags() retrieving tags from DB for tag ids: ${JSON.stringify(tagIds)}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteTag(tagId: string): Promise<{ deleted: boolean; id: string }> {
    try {
      await this.tagsRepository.delete(tagId);
    } catch (error) {
      this.logger.error(
        `Error in deleteTag() deleting tag from DB for tag ids: ${JSON.stringify(tagId)}`,
        error,
      );
      throw new InternalServerErrorException();
    }

    return {
      deleted: true,
      id: tagId,
    };
  }

  async softDeleteTag(
    tagId: string,
  ): Promise<{ deleted: boolean; id: string }> {
    await this.tagsRepository.softDelete(tagId);

    return {
      deleted: true,
      id: tagId,
    };
  }
}
