import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entity/submission';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  /**
   * This query is not very performant without sort, filter, pagination.
   * Limiting result set to 20 records for POC.
   */
  async findAll(): Promise<Submission[]> {
    return await this.submissionRepository.find({
      take: 20,
    });
  }

  /**
   * This query returns a single submission
   *
   * Note: It should also be joining the figure table to return data for the
   * submission. According to TypeORM docs, this can be achieved by passing
   * find options such as: { relations: ['data'] }
   *
   * @param adsh the submission id
   */
  async findOne(adsh: string): Promise<Submission> {
    return await this.submissionRepository.findOne(adsh);
  }
}
