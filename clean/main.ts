import { Contact } from '../shared/types';
import { query } from '../shared/db.js';

async function dots() {
  const { rows } = await query<Contact>("SELECT * FROM contacts WHERE phone1 LIKE '%.%.%'", []);

  rows.forEach((row) => {
    const phone = row.phone1.replace(/\./g, '-');
    query<Contact>(
      'UPDATE contacts SET phone1 = $1 WHERE id = $2',
      [phone, `${row.id}`],
    );
  });
}

async function parens() {
  const { rows } = await query<Contact>("SELECT * FROM contacts WHERE phone1 LIKE '%) %'", []);

  rows.forEach((row) => {
    const phone = row.phone1.replace(/\(/g, '').replace(/\) /g, '-');
    query<Contact>(
      'UPDATE contacts SET phone1 = $1 WHERE id = $2',
      [phone, `${row.id}`],
    );
  });
}

async function phone1() {
  const { rows } = await query<Contact>("SELECT * FROM contacts WHERE phone1 LIKE 'Phone:%'", []);

  rows.forEach((row) => {
    const phone = row.phone1.split(' ');
    query<Contact>(
      'UPDATE contacts SET phone1 = $1 WHERE id = $2',
      [phone[1], `${row.id}`],
    );
  });

  query<Contact>("UPDATE contacts SET phone1 = '' WHERE phone1 = 'No Phone Available'", []);
}

async function postcodes() {
  const { rows } = await query<Contact>('SELECT * FROM contacts WHERE postcode is not null', []);

  rows.forEach((row) => {
    if (parseInt(row.postcode, 10) < 10000) {
      query<Contact>(
        'UPDATE contacts SET postcode = $1 WHERE id = $2',
        [`0${parseInt(row.postcode, 10)}`, `${row.id}`],
      );
    }
  });
}

async function postcode4s() {
  const { rows } = await query<Contact>('SELECT * FROM contacts WHERE postcode4 is not null', []);

  rows.forEach((row) => {
    if (parseInt(row.postcode4, 10) < 100) {
      query<Contact>(
        'UPDATE contacts SET postcode4 = $1 WHERE id = $2',
        [`00${parseInt(row.postcode4, 10)}`, `${row.id}`],
      );
    } else if (parseInt(row.postcode4, 10) < 1000) {
      query<Contact>(
        'UPDATE contacts SET postcode4 = $1 WHERE id = $2',
        [`0${parseInt(row.postcode4, 10)}`, `${row.id}`],
      );
    }
  });
}

async function slash() {
  const { rows } = await query<Contact>("SELECT * FROM contacts WHERE phone1 LIKE '%/%-%'", []);

  rows.forEach((row) => {
    const phone = row.phone1.replace(/\//g, '-');
    query<Contact>(
      'UPDATE contacts SET phone1 = $1 WHERE id = $2',
      [phone, `${row.id}`],
    );
  });
}

(async () => {
  dots();
  parens();
  phone1();
  postcodes();
  postcode4s();
  slash();
})();
