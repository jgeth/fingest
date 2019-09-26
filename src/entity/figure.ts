import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Submission } from './submission';

/**
 * The Figure entity represents SEC filing submission numbers. Figures
 * correspond in a one-many relationship with a single filing submission.
 */
@Entity()
export class Figure {
  @PrimaryColumn({ length: 20 })
  @ManyToOne(type => Submission, submission => submission.data)
  adsh: string;

  @PrimaryColumn({ length: 256 })
  tag: string;

  @PrimaryColumn({ length: 20 })
  version: string;

  @PrimaryColumn({ length: 256 })
  coreg: string;

  @PrimaryColumn({ length: 8 })
  // TODO: convert ingest values to a DATE type
  ddate: string;

  @PrimaryColumn({ type: 'numeric' })
  qtrs: number;

  @PrimaryColumn({ length: 20 })
  uom: string;

  @Column({ type: 'decimal', precision: 28, scale: 4 })
  value: number;

  @Column({ type: 'text' })
  footnote: string;
}
