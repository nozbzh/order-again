import { ItemInterface } from "./Item";
import { UserInterface } from "./User";

export interface RatingInterface {
  id: string;
  value: string;
  note: string;
  itemId: string;
  userId: string;
}

export interface RatingInternalData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
