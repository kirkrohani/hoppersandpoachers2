import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './providers/tags.service';
import { TagsRepository } from './tags.repository';

@Module({
  controllers: [TagsController],
  imports: [TypeOrmModule.forFeature([TagsRepository])],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
