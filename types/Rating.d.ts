import { ItemInterface } from "./Item";
import { UserInterface } from "./User";

export interface RatingInterface {
  id: string;
  value: string;
  note: string;
  item: ItemInterface;
  user: UserInterface;
}
