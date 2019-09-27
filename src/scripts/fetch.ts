import axios from 'axios';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as unzip from 'unzipper';

const DOWNLOAD_TIMEOUT_MILLIS = 600000; // 10 minutes

const STATEMENT = '2019q2';
const FILENAME = STATEMENT + '.zip';

const REMOTE_DATA_FILE = `https://www.sec.gov/files/dera/data/financial-statement-data-sets/${FILENAME}`;

const LOCAL_FILE_DIR = 'downloads';
const LOCAL_DATA_FILE = `${LOCAL_FILE_DIR}/${FILENAME}`;
const LOCAL_DATA_DIR = `${LOCAL_FILE_DIR}/${STATEMENT}`;

(async () => {
  // Fetch file from SEC
  await fetchRemoteDataFile({
    remoteFile: REMOTE_DATA_FILE,
    localTarget: LOCAL_DATA_FILE,
  });

  // Unzip local file
  await extractDataFiles({
    compressedFile: LOCAL_DATA_FILE,
    extractTarget: LOCAL_DATA_DIR,
  });
})()
  .catch(err => {
    // tslint:disable-next-line:no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    // Clean up unzipped files
    rimraf(LOCAL_DATA_DIR, () =>
      // tslint:disable-next-line:no-console
      console.log('Temp data dir removed'),
    );
  });

/**
 * Fetches a collection of SEC financial statements based on fiscal quarter
 *
 * @param statement the fiscal quarter of statements to fetch
 */
async function fetchRemoteDataFile({
  remoteFile,
  localTarget,
}: {
  remoteFile: string;
  localTarget: string;
}) {
  if (!fs.existsSync(localTarget)) {
    const writer = fs.createWriteStream(localTarget);
    // tslint:disable-next-line:no-console
    console.log(`fetching file: ${remoteFile}`);
    const response = await axios.get(remoteFile, {
      timeout: DOWNLOAD_TIMEOUT_MILLIS,
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } else {
    // tslint:disable-next-line:no-console
    console.log(`file exists: ${localTarget}`);
  }
}

/**
 * Uncompresses an SEC data file (.zip) into individual data files
 *
 * @param compressedFile the compressed file (zip)
 * @param extractTarget the path to write extracted files
 */
async function extractDataFiles({
  compressedFile,
  extractTarget,
}: {
  compressedFile: string;
  extractTarget: string;
}) {
  // tslint:disable-next-line:no-console
  console.log(`extracting files from: ${compressedFile}`);

  const stream = fs.createReadStream(compressedFile);
  stream.pipe(unzip.Extract({ path: extractTarget }));

  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}
