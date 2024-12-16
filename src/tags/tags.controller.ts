import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDTO } from './dtos/create-tag.dto';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagsController {
  private logger = new Logger('TagsController');

  constructor(private tagsService: TagsService) {}

  @Post()
  createTag(@Body() createTagDto: CreateTagDTO): Promise<Tag> {
    this.logger.verbose(
      `Tags Controller createTag method ${JSON.stringify(createTagDto)}`,
    );
    return this.tagsService.createTag(createTagDto);
  }

  @Delete('/:tagId')
  deleteTag(
    @Param('tagId') tagId: string,
  ): Promise<{ deleted: boolean; id: string }> {
    this.logger.verbose(
      `Tags Controller deleteTag method ${JSON.stringify(tagId)}`,
    );
    return this.tagsService.deleteTag(tagId);
  }

  @Delete('/delete/:tagId')
  softDeleteTag(
    @Param('tagId') tagId: string,
  ): Promise<{ deleted: boolean; id: string }> {
    this.logger.verbose(
      `Tags Controller softDeleteTag method ${JSON.stringify(tagId)}`,
    );
    return this.tagsService.softDeleteTag(tagId);
  }
}
