import { Body, Controller, Get, Param } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { Submission } from '../entity/submission';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  /**
   * The GET method without any params retrieves all submissions. This method
   * will not very performant or useful without filtering or pagination (and
   * sort) capabilities.
   *
   * TODO: Add sort, filter, pagination
   */
  @Get()
  findAll(): Promise<Submission[]> {
    return this.submissionService.findAll();
  }

  /**
   * The GET method with an 'adsh' param retrieves a single submission by its
   * unique identifier.
   */
  @Get(':adsh')
  findOne(@Param() params): Promise<Submission> {
    return this.submissionService.findOne(params.adsh);
  }
}
