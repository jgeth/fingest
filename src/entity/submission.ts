import {
  Column,
  // CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Figure } from './figure';

/**
 * The Submission entity represents an SEC financial statement filing.
 */
@Entity()
export class Submission {
  @PrimaryColumn({ length: 20 })
  // TODO: Typify adsh with a Regex Validation pattern (nnnnnnnnnn-nn-nnnnnn)
  adsh: string;

  // @CreateDateColumn()
  // createdAt: string;

  @Column({ type: 'numeric' })
  cik: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'numeric', nullable: true })
  // Standard Industrial Classification (SIC)
  sic: number;

  @Column({ length: 2 })
  // TODO: Use an enum type of ISO 3166-1 country codes
  countryba: string;

  @Column({ length: 2, nullable: true })
  // TODO: Use an enum type of states/province codes
  stprba: string;

  @Column({ length: 30 })
  cityba: string;

  @Column({ length: 10, nullable: true })
  zipba: string;

  @Column({ length: 40, nullable: true })
  bas1: string;

  @Column({ length: 40, nullable: true })
  bas2: string;

  @Column({ length: 12, nullable: true })
  baph: string;

  @Column({ length: 2, nullable: true })
  // TODO: Use an enum type of ISO 3166-1 country codes
  countryma: string;

  @Column({ length: 2, nullable: true })
  // TODO: Use an enum type of states/province codes
  stprma: string;

  @Column({ length: 30, nullable: true })
  cityma: string;

  @Column({ length: 10, nullable: true })
  zipma: string;

  @Column({ length: 40, nullable: true })
  mas1: string;

  @Column({ length: 40, nullable: true })
  mas2: string;

  @Column({ length: 3 })
  // Country of incorporation (if US or CA)
  countryinc: string;

  @Column({ length: 2, nullable: true })
  // State of incorporation (if US or CA)
  stprinc: string;

  @Column({ type: 'numeric', nullable: true })
  // Employee Identification Number (EIN)
  ein: number;

  @Column({ length: 150, nullable: true })
  former: string;

  @Column({ length: 8, nullable: true })
  // TODO: use a date type (yyyymmdd)
  readonly changed: string;

  @Column({ length: 5, nullable: true })
  afs: FilerStatus;

  @Column({ type: 'boolean' })
  wksi: boolean;

  @Column({ length: 4 })
  // TODO: use a custom date type (mmdd)
  fye: string;

  @Column({ length: 10 })
  form: string;

  @Column({ length: 8 })
  // TODO: use a custom date type (yymmdd)
  period: string;

  @Column({ length: 4 })
  // TODO: use a custom date type (yyyy)
  fy: string;

  @Column({ length: 2 })
  // TODO: use an enum for defined Fiscal Period values
  fp: string;

  @Column({ length: 8 })
  // TODO: use a custom date type (yymmdd)
  filed: string;

  @Column({ length: 19 })
  // TODO: use a datetime type (yyyy-mm-dd hh:mm:ss) ISO
  accepted: string;

  @Column({ type: 'boolean' })
  prevrpt: boolean;

  @Column({ type: 'boolean' })
  detail: boolean;

  @Column({ length: 32 })
  instance: string;

  @Column({ type: 'numeric' })
  nciks: number;

  @Column({ length: 120, nullable: true })
  aciks: string;

  @OneToMany(type => Figure, figure => figure.adsh)
  data: Figure[];
}

export enum FilerStatus {
  LargeAccelerated = '1-LAF', // 'Large Accelerated'
  Accelerated = '2-ACC', // 'Accelerated'
  SmallerReportingAccelerated = '3-SRA', // 'Smaller Reporting Accelerated'
  NonAccelerated = '4-NON', // 'Non-Accelerated'
  SmallerReportingFiler = '5-SML', // 'Smaller Reporting Filer'
  NotAssigned = 'NULL', // 'not assigned'
}
