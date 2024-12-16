import { Injectable } from '@nestjs/common';
import { TagsRepository } from '../tags.repository';
import { CreateTagDTO } from '../dtos/create-tag.dto';
import { Tag } from '../tag.entity';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject Tag Repository
     */
    private tagsRepo: TagsRepository,
  ) {}

  /**
   * Create Tag method, calls Tag Repository
   * @param createTagDto
   * @returns Promise<Tag>
   */
  async createTag(createTagDto: CreateTagDTO): Promise<Tag> {
    return await this.tagsRepo.createTag(createTagDto);
  }

  async findTags(tagIds: string[]): Promise<Tag[]> {
    return await this.tagsRepo.findTags(tagIds);
  }

  async deleteTag(tagId: string): Promise<{ deleted: boolean; id: string }> {
    await this.tagsRepo.deleteTag(tagId);

    return {
      deleted: true,
      id: tagId,
    };
  }

  async softDeleteTag(
    tagId: string,
  ): Promise<{ deleted: boolean; id: string }> {
    await this.tagsRepo.softDelete(tagId);

    return {
      deleted: true,
      id: tagId,
    };
  }
}
