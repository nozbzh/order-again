import { RatingInterface } from "./Rating";
import { EstablishmentInterface } from "./Establishment";

export interface ItemInterface {
  id: string;
  name: string;
  // establishment: EstablishmentInterface;
  establishmentId: string;
  ratings: RatingInterface[];
}

export interface ItemInternalData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
