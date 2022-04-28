import fs from "fs";
import { parse} from "@fast-csv/parse";
import { Contact } from "./types";
import { query } from "./db";

async function run() {
  console.log(process.argv[2]);

  fs.createReadStream(process.argv[2])
    .pipe(parse())
    .on("error", error => console.error(error))
    .on("data", row => {
      if (row.length === 5) {
        query<Contact>("INSERT INTO contacts (organization, address1, contact, email, phone1) VALUES ($1, $2, $3, $4, $5) RETURNING id", [row[0], row[1], row[2], row[3], row[4]])
          .catch(async err => {
            console.error(err);
          });
      } else if (row.length === 6) {
        query<Contact>("INSERT INTO contacts (organization, address1, contact, email, phone1) VALUES ($1, $2, $3, $4, $5) RETURNING id", [row[0], row[1], row[2], row[3], row[4]])
          .catch(async err => {
            console.error(err);
          });
      } else if (row.length === 11) {
        query<Contact>("INSERT INTO contacts (organization, contact, address1, email, phone1) VALUES ($1, $2, $3, $4, $5) RETURNING id", [row[0], row[2], row[1], row[3], row[4]])
          .catch(async err => {
            console.error(err);
          });
      } else if (row.length === 12) {
        query<Contact>("INSERT INTO contacts (organization, contact, address1, city, statecode, postcode, phone1) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id", [row[0], row[1], row[2], row[3], row[4], row[5], row[6]])
          .catch(async err => {
            console.error(err);
          });
      } else if (row.length === 33) {
        query<Contact>("INSERT INTO contacts (organization, contact, address1, phone1) VALUES ($1, $2, $3, $4) RETURNING id", [row[0], row[2], row[1], row[3]])
          .catch(async err => {
            console.error(err);
          });

      }
    })
    .on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
}

(async () => {
  run();
})();
