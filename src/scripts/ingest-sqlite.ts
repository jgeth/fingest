import { exec } from 'child_process';
import * as fs from 'fs';

/**
 * SQLite data ingester
 *
 * This is a brute-force approach to importing data files into a SQLite DB.
 * This is used only to by-pass a more complex data ingestion process.
 */

const DATABASE = 'fingest.db';

const STATEMENT = '2019q2';

const ENCODING = 'utf8';
const DELIMITER = '\t';

const LOCAL_FILE_DIR = 'downloads';
const LOCAL_DATA_DIR = `${LOCAL_FILE_DIR}/${STATEMENT}`;

const SUB_FILE = `${LOCAL_DATA_DIR}/sub.txt`;
const NUM_FILE = `${LOCAL_DATA_DIR}/num.txt`;

(async () => {
  // Process Submission file
  await importDataFile(DATABASE, SUB_FILE, 'submission');

  // Process Numbers file
  await importDataFile(DATABASE, NUM_FILE, 'figure');
})().catch(err => {
  // tslint:disable-next-line:no-console
  console.error(err);
  process.exit(1);
});

/**
 * Imports a data file into an SQLite DB
 * @param file the file to be imported
 * @param table the table to import to
 */
async function importDataFile(database: string, file: string, table: string) {
  const importFile = `${file}.import`;
  const content = `.separator "\t"\n.import ${file} ${table}`;
  fs.writeFile(importFile, content, err => {
    if (err) {
      // tslint:disable-next-line:no-console
      return console.error(err);
    }
  });

  const command = exec(`sqlite3 ${database} < ${importFile}`, error => {
    if (error) {
      // tslint:disable-next-line:no-console
      console.error(error.stack);
    }
  });

  return new Promise((resolve, reject) => {
    command.on('exit', resolve);
    command.on('error', reject);
  });
}
