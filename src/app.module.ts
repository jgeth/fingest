import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubmissionModule } from './submissions/submission.module';

@Module({
  imports: [
    SubmissionModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'fingest.db',
      entities: [__dirname + '/entity/*.ts'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
