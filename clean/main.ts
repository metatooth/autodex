import fs from 'fs';
import { Contact } from '../shared/types';
import { query } from '../shared/db.js';

async function dots() {
  const { rows } =  await query<Contact>("SELECT * FROM contacts WHERE phone1 LIKE '%\.%\.%'", []);

  rows.forEach((row) => {
    const phone = row.phone1.replace(/\./g, "-");
    query<Contact>("UPDATE contacts SET phone1 = $1 WHERE id = $2",
                   [phone, `${row.id}`]);
  });
}

async function parens() {
  const { rows } =  await query<Contact>("SELECT * FROM contacts WHERE phone1 LIKE '(%) %'", []);
  
  rows.forEach((row) => {
    const phone = row.phone1.replace(/\(/g, "").replace(/\) /g, "-");
    query<Contact>("UPDATE contacts SET phone1 = $1 WHERE id = $2",
                   [phone, `${row.id}`]);
  });

}

async function postcodes() {
  const { rows } =  await query<Contact>("SELECT * FROM contacts WHERE postcode is not null", []);

  rows.forEach((row) => {
    if (parseInt(row.postcode) < 10000) {
      query<Contact>("UPDATE contacts SET postcode = $1 WHERE id = $2",
                     [`0${row.postcode}`, `${row.id}`]);
    }
  });

}

async function postcode4s() {
  const { rows } =  await query<Contact>("SELECT * FROM contacts WHERE postcode4 is not null", []);

  rows.forEach((row) => {
    if (parseInt(row.postcode4) < 100) {
      query<Contact>("UPDATE contacts SET postcode4 = $1 WHERE id = $2",
                     [`00${row.postcode4}`, `${row.id}`]);

    } else if (parseInt(row.postcode4) < 1000) {
      query<Contact>("UPDATE contacts SET postcode4 = $1 WHERE id = $2",
                     [`0${row.postcode4}`, `${row.id}`]);
    }
  });

}

async function slash() {
  const { rows } =  await query<Contact>("SELECT * FROM contacts WHERE phone1 LIKE '%\/%\-%'", []);

  rows.forEach((row) => {
    const phone = row.phone1.replace(/\//g, "-");
    query<Contact>("UPDATE contacts SET phone1 = $1 WHERE id = $2",
                   [phone, `${row.id}`]);
  });
}

(async () => {
  dots();
  parens();
  postcodes();
  postcode4s();
  slash();
})();
