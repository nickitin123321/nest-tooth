import { Module } from '@nestjs/common';
import { ToothsController } from './tooths.controller';
import { ToothsService } from './tooths.service';

@Module({
  controllers: [ToothsController],
  providers: [ToothsService],
})
export class ToothsModule {}
