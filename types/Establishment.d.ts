import { ItemInterface } from "./Item";

export interface EstablishmentInterface {
  // id: string;
  name: string;
  address: string;
  latitude?: string;
  longitude?: string;
  items?: ItemInterface[];
}

export interface EstablishmentInternalData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
