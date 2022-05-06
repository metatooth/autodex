import fs from 'fs';
import { parse } from '@fast-csv/parse';
import { Contact } from '../shared/types';
import { query } from '../shared/db';

async function handleFive(entry) {
  const addy = entry[1].split(',');
  if (addy.length === 2) {
    query<Contact>('INSERT INTO contacts (organization, city, statecode, contact, email, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [entry[0], addy[0], addy[1].trim(), entry[2], entry[3], entry[4], entry[1]])
      .catch(async (err) => {
              console.error(err);
      });
  } else {
    console.log('unhandled', entry);
  }
}

async function handleSeven(entry) {
  const addy = entry[1].split(',');
  if (addy.length === 2) {
    query<Contact>('INSERT INTO contacts (organization, city, statecode, contact, email, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [entry[0], addy[0], addy[1].trim(), entry[2], entry[3], entry[4], entry[1]])
      .catch(async (err) => {
        console.error(err);
      });
  } else { 
    console.log('unhandled', entry);
  }     
}

async function handleEleven(entry) {
  const parts = entry[1].split(',');

  if (parts.length > 1) {
    const addy = parts[parts.length - 1].split(' ');    
    const city = addy[addy.length - 1];
    const statezip = parts[1].trim().split(' ');

    addy.pop();
    const address = addy.join(' ');

    query<Contact>('INSERT INTO contacts (organization, contact, address1, city, statecode, postcode, email, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id', [entry[0], entry[2].trim(), address, city, statezip[0], statezip[1], entry[3], entry[4], entry[1]])
      .catch(async (err) => {
        console.error(err);
      });
  } else {
    console.log("unhandled", entry);
  }
}

async function handleTwelve(entry) {
  query<Contact>('INSERT INTO contacts (organization, contact, address1, city, statecode, postcode, postcode4, phone1) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [entry[0], entry[1], entry[2], entry[3], entry[4], entry[5], entry[6], entry[7]])
    .catch(async (err) => {
      console.error(err);
    });
  
}

async function handleThirtyThree(entry) {
  const parts = entry[1].split(',');
  
  if (parts.length > 1) {
    const addy = parts[parts.length - 1].split(' ');    
    const city = addy[addy.length - 1];
    const statezip = parts[1].trim().split(' ');

    addy.pop();
    const address = addy.join(' ');

    query<Contact>('INSERT INTO contacts (organization, contact, address1, city, statecode, postcode, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [entry[0], entry[2], address, city, statezip[0], statezip[1], entry[3], entry[1]])
      .catch(async (err) => {
        console.error(err);
      });
  } else {
    console.log("unhandled", entry);
  }
}


async function run() {
  console.log(process.argv[2]);

  fs.createReadStream(process.argv[2])
    .pipe(parse())
    .on('data', (row) => {
      if (row.length === 5) {
        handleFive(row);
      } else if (row.length === 7) {
        handleSeven(row);
      } else if (row.length === 11) {
        handleEleven(row);
      } else if (row.length === 12) {
        handleTwelve(row);
      } else if (row.length === 33) {
        handleThirtyThree(row);
      } else {
        console.log("unhandled", row.length, row);
      }
    })
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));


  
}

(async () => {
  run();
})();
