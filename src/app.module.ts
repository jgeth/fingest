import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubmissionModule } from './submissions/submission.module';
import { Figure } from './entity/figure';
import { Submission } from './entity/submission';

@Module({
  imports: [
    SubmissionModule,
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'sqlite',
      database: 'fingest.db',
      entities: [Figure, Submission],
      // logging: ['query', 'error'],
      // synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
