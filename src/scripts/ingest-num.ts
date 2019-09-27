import * as fs from 'fs';
import * as es from 'event-stream';
import { createConnection, getRepository, Repository } from 'typeorm';
import { Figure } from '../entity/figure';

const STATEMENT = '2019q2';

const ENCODING = 'utf8';
const DELIMITER = '\t';

const LOCAL_FILE_DIR = 'downloads';
const LOCAL_DATA_DIR = `${LOCAL_FILE_DIR}/${STATEMENT}`;

const NUM_FILE = `${LOCAL_DATA_DIR}/num.txt`;

/**
 * Use an async main method to support async/await, specifically to wait on a
 * DB connection (may also be useful for additional cases)
 */
(async () => {
  // Establish connection to DB and create entity repository
  // tslint:disable-next-line:no-console
  console.log('Creating DB connection');
  const connection = await createConnection();
  const figureRepository = getRepository(Figure);

  /**
   * Transforms a row of numbers data into the figure repository. This uses
   * the shared figure entity to transform raw data fields to specified
   * types.
   *
   * For auditing purposes, this insertion auto-generates a record creation
   * timestamp and saves the "source" field for tracing record back to original
   * SEC data set.
   *
   * @param row the raw string of number data to transform
   * @param cb callback
   */
  function transformFigure(row: string, cb: any) {
    const fields = row.split(DELIMITER);
    try {
      if (fields[0] && fields[0] !== 'adsh') {
        figureRepository.insert({
          adsh: fields[0],
          tag: fields[1],
          version: fields[2],
          coreg: fields[3] || 'null',
          ddate: fields[4],
          qtrs: Number(fields[5]),
          uom: fields[6],
          value: Number(fields[7]),
          footnote: fields[8],
          source: STATEMENT,
        });
      }
      return cb();
    } catch (err) {
      return cb(new Error('Could not create record for: ' + row));
    }
  }

  // tslint:disable-next-line:no-console
  console.log('processing num file...');

  /**
   * Stream-process numbers data
   */
  fs.createReadStream(NUM_FILE, { encoding: ENCODING })
    .pipe(es.split())
    .pipe(
      es.map(line => {
        transformFigure(line, err => {
          if (err) {
            // tslint:disable-next-line:no-console
            console.error(err);
          }
        });
      }),
    );
})().catch(err => {
  // tslint:disable-next-line:no-console
  console.error(err);
  process.exit(1);
});
