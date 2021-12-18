import { RatingInterface } from "./Rating";
import { EstablishmentInterface } from "./Establishment";

export interface ItemInterface {
  id: string;
  name: string;
  establishment: EstablishmentInterface;
  ratings: RatingInterface[];
}
