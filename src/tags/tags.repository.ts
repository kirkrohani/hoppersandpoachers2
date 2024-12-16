import { EntityRepository, In, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTagDTO } from './dtos/create-tag.dto';

@EntityRepository(Tag)
export class TagsRepository extends Repository<Tag> {
  private logger = new Logger('TagRepository', { timestamp: true });

  /**
   * Create Tag Method whichs creates a new Tag object in DB
   * @param creatTagDto
   * @returns Promise<Tag>
   */
  async createTag(creatTagDto: CreateTagDTO): Promise<Tag> {
    try {
      const tag = this.create(creatTagDto);
      this.save(tag);
      return tag;
    } catch (error) {
      this.logger.error(
        `Error in createTag() saving tag to DB and create tag data: ${JSON.stringify(creatTagDto)}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find Tags returns array of Tags given array of Tag Ids
   * @param tagIds
   * @returns
   */
  async findTags(tagIds: string[]): Promise<Tag[]> {
    try {
      const results = await this.find({
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

  async deleteTag(tagId: string) {
    try {
      await this.delete(tagId);
    } catch (error) {
      this.logger.error(
        `Error in deleteTag() deleting tag from DB for tag ids: ${JSON.stringify(tagId)}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }
}
