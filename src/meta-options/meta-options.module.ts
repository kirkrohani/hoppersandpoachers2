import { Module } from '@nestjs/common';
import { MetaOptionsController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOptionsService } from './providers/meta-options.service';
import { MetaOptionsRepository } from './meta-options.repository';

@Module({
  controllers: [MetaOptionsController],
  imports: [TypeOrmModule.forFeature([MetaOptionsRepository])],
  providers: [MetaOptionsService],
})
export class MetaOptionsModule {}
