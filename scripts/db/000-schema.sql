begin;

create table contacts (
  id serial primary key,
  organization varchar(255),
  location varchar(255),
  contact varchar(255),
  address1 varchar(255),
  address2 varchar(255),
  city varchar(255),
  statecode varchar(255),
  postcode varchar(255),
  postcode4 varchar(255),
  email varchar(255),
  phone1 varchar(255),
  phone2 varchar(255),
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

commit;
