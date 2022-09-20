import { Module } from '@nestjs/common';
import { TimeentriesService } from './timeentries.service';
import { TimeentriesController } from './timeentries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './timeentries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry])],
  exports: [TypeOrmModule, TimeentriesService],
  providers: [TimeentriesService],
  controllers: [TimeentriesController]
})
export class TimeentriesModule {}
