export interface Contact {
  id: number;
  organization: string;
  location: string;
  contact: string;
  address1: string;
  city: string;
  statecode: string;
  postcode: string;
  postcode4: string;
  email: string;
  phone1: string;
  phone2: string;
  createdat: Date;
  updatedat: Date;

  [key: string]: any;
}
