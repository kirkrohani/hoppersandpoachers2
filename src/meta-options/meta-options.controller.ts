import { Body, Controller, Post } from '@nestjs/common';
import { CreateMetaOptionsDTO } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('meta-options')
@ApiTags('META OPTIONS')
export class MetaOptionsController {
  /**
   *  Final Endpoint - http://localhost:3001/meta-options
   * @param metaOptionsService
   */
  constructor(
    //Inject MetaOptionsService
    private metaOptionsService: MetaOptionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'creates a new meta option in db',
  })
  @ApiBody({
    description:
      'metaValue is a JSON object of key value pairs of the meta data for this post',
    required: true,
  })
  public create(@Body() createPostMetaOptionsDTO: CreateMetaOptionsDTO) {
    return this.metaOptionsService.createMetaOption(createPostMetaOptionsDTO);
  }
}
