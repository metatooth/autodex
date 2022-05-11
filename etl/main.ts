import fs from 'fs';
import { parse } from '@fast-csv/parse';
import { Contact } from '../shared/types';
import { query } from '../shared/db.js';

async function handleFive(entry: Array<string>) {
  const addy = entry[1].split(',');
  if (addy.length === 2) {
    query<Contact>('INSERT INTO contacts (organization, city, statecode, contact, email, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [entry[0].trim(), addy[0].trim(), addy[1].trim(), entry[2].trim(), entry[3].trim(), entry[4].trim(), entry[1]])
      .catch(async (err) => {
        console.error(err);
      });
  } else {
    console.log('unhandled', entry);
  }
}

async function handleSeven(entry: Array<string>) {
  const addy = entry[1].split(',');
  if (addy.length === 2) {
    query<Contact>('INSERT INTO contacts (organization, city, statecode, contact, email, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [entry[0].trim(), addy[0].trim(), addy[1].trim(), entry[2].trim(), entry[3].trim(), entry[4].trim(), entry[1]])
      .catch(async (err) => {
        console.error(err);
      });
  } else {
    console.log('unhandled', entry);
  }
}

async function handleEleven(entry: Array<string>) {
  const parts = entry[1].split(',');
  const num = parts.length;

  if (num > 1) {
    const statezip = parts[parts.length - 1].trim().split(' ');

    if (statezip.length === 2) {
      const state = statezip[0];
      let postcode = statezip[1];
      let postcode4 = '';

      if (postcode.match('-')) {
        const codes = postcode.split('-');
        [postcode, postcode4] = codes;
      }

      const addy = parts[0].split(' ');
      let city = addy[addy.length - 1];

      addy.pop();
      let address = addy.join(' ');

      if (num === 3) {
        parts.pop();
        const t = parts[1].split(' ');
        city = t[t.length - 1];

        t.pop();
        address = `${parts[0]} ${t.join(' ')}`;
      }

      query<Contact>('INSERT INTO contacts (organization, contact, address1, city, statecode, postcode, postcode4, email, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id', [entry[0].trim(), entry[2].trim(), address.trim(), city.trim(), state.trim(), postcode.trim(), postcode4.trim(), entry[4].trim(), entry[5].trim(), entry[1]])
        .catch(async (err) => {
          console.error(err);
        });
    } else if (parts.length === 2) {
      query<Contact>('INSERT INTO contacts (organization, contact, city, statecode, email, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [entry[0].trim(), entry[2].trim(), parts[0].trim(), parts[1].trim(), entry[4].trim(), entry[5].trim(), entry[1]])
        .catch(async (err) => {
          console.error(err);
        });
    } else {
      console.log('unhandled statezip', entry);
    }
  } else {
    console.log('unhandled parts', entry);
  }
}

async function handleTwelve(entry: Array<string>) {
  query<Contact>('INSERT INTO contacts (organization, contact, address1, city, statecode, postcode, postcode4, phone1) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [entry[0].trim(), entry[1].trim(), entry[2].trim(), entry[3].trim(), entry[4].trim(), entry[5].trim(), entry[6].trim(), entry[7]])
    .catch(async (err) => {
      console.error(err);
    });
}

async function handleThirtyThree(entry: Array<string>) {
  const parts = entry[1].split(',');
  const num = parts.length;

  if (num === 2) {
    let addy = parts[parts.length - 1].trim().split(' ');

    if (addy.length === 1) {
      const city = parts[0].trim();
      const state = parts[1].trim();

      query<Contact>('INSERT INTO contacts (organization, contact, city, statecode, phone1, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [entry[0].trim(), entry[2].trim(), city.trim(), state.trim(), entry[3].trim(), entry[1]])
        .catch(async (err) => {
          console.error(err);
        });
    } else if (addy.length === 2) {
      const state = addy[0];
      const zip = addy[1];

      addy = parts[0].trim().split(' ');

      const city = addy[addy.length - 1];

      addy.pop();
      const address = addy.join(' ');

      query<Contact>('INSERT INTO contacts (organization, contact, address1, city, statecode, postcode, phone1, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [entry[0].trim(), entry[2].trim(), address.trim(), city.trim(), state.trim(), zip.trim(), entry[3].trim(), entry[1]])
        .catch(async (err) => {
          console.error(err);
        });
    } else {
      console.log('unhandled state zip', entry);
    }
  } else {
    console.log('unhandled', entry);
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
        console.log('unhandled', row.length, row);
      }
    })
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
}

(async () => {
  run();
})();
