import { IBoardgameMeepley } from "./boardgames/IBoardgame";
import { IPlace } from "./IPlace";
import { IUser } from "./IUser";

export interface IMatchroom {
  id: number;
  name: string;
  description?: string;
  image: string;
  private: boolean;
  invite_code: string;
  is_ongoing: boolean;
  min_players: number;
  max_players: number;
  estimated_duration: string;
  scheduled_date: string;
  scheduled_hour: string;
  scheduled_day: string;
  boardgames: {
    matchrooms_id: number;
    boardgames_id: number;
    updated_at: string;
    created_at: string;
    boardgame: IBoardgameMeepley;
  }[];
  users: {
    matchrooms_id: number;
    users_id: number;
    updated_at: string;
    created_at: string;
    user: IUser;
  }[];
  place: IPlace;
  admin: IUser;
  updated_at: Date;
  created_at: Date;
}
