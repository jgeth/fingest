import * as fs from 'fs';
import * as es from 'event-stream';
import { createConnection, getRepository, Repository } from 'typeorm';
import { Submission } from '../entity/submission';

const STATEMENT = '2019q2';

const ENCODING = 'utf8';
const DELIMITER = '\t';

const LOCAL_FILE_DIR = 'downloads';
const LOCAL_DATA_DIR = `${LOCAL_FILE_DIR}/${STATEMENT}`;

const SUB_FILE = `${LOCAL_DATA_DIR}/sub.txt`;

/**
 * Use an async main method to support async/await, specifically to wait on a
 * DB connection (may also be useful for additional cases)
 */
(async () => {
  // Establish connection to DB and create entity repository
  // tslint:disable-next-line:no-console
  console.log('Creating DB connection');
  const connection = await createConnection();
  const submissionRepository = getRepository(Submission);

  /**
   * Transforms a row of submission data into the submission repository. This
   * uses the shared submission entity to transform raw data fields to
   * specified types.
   *
   * For auditing purposes, this insertion auto-generates a record creation
   * timestamp and saves the "source" field for tracing record back to original
   * SEC data set.
   *
   * @param row the raw string of submission data to transform
   * @param cb callback
   */
  function transformSubmission(row: string, cb: any) {
    const fields = row.split(DELIMITER);
    try {
      if (fields[0] && fields[0] !== 'adsh') {
        submissionRepository.insert({
          adsh: fields[0],
          cik: Number(fields[1]),
          name: fields[2],
          sic: Number(fields[3]),
          countryba: fields[4],
          stprba: fields[5],
          cityba: fields[6],
          zipba: fields[7],
          bas1: fields[8],
          bas2: fields[9],
          baph: fields[10],
          countryma: fields[11],
          stprma: fields[12],
          cityma: fields[13],
          zipma: fields[14],
          mas1: fields[15],
          mas2: fields[16],
          countryinc: fields[17],
          stprinc: fields[18],
          ein: Number(fields[19]),
          former: fields[20],
          changed: fields[21],
          afs: fields[22],
          wksi: Number(fields[23]) === 1,
          fye: fields[24],
          form: fields[25],
          period: fields[26],
          fy: fields[27],
          fp: fields[28],
          filed: fields[29],
          accepted: fields[30],
          prevrpt: Number(fields[31]) === 1,
          detail: Number(fields[32]) === 1,
          instance: fields[33],
          nciks: Number(fields[34]),
          aciks: fields[35],
          source: STATEMENT,
        });
      }
      return cb();
    } catch (err) {
      return cb(new Error('Could not create record for adsh: ' + fields[0]));
    }
  }

  // tslint:disable-next-line:no-console
  console.log('processing sub file...');

  /**
   * Stream-process submission data
   */
  fs.createReadStream(SUB_FILE, { encoding: ENCODING })
    .pipe(es.split())
    .pipe(
      es.map(line => {
        transformSubmission(line, err => {
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
