import { IBoardgameMeepley } from "./boardgames/IBoardgame";
import { IMatchroom } from "./IMatchroom";
import { IPlaceType } from "./IPlaceType";

export interface IPlace {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  hours_open: string;
  minimum_consumption: number | null;
  image: string;
  average_rating: number;
  sells_boardgames: boolean;
  city: string;
  open_days: string[];
  updated_at: string;
  created_at: string;
  types: {
    places_id: number;
    place_types_id: number;
    updated_at: string;
    created_at: string;
    type: IPlaceType;
  }[];
  matchrooms: IMatchroom[];
  boardgames: IBoardgameMeepley[];
}
