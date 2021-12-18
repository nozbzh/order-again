import { RatingInterface } from "./Rating";

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  ratings: RatingInterface[];
}
