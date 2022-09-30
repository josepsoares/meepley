import { isQueryKey } from "react-query/types/core/utils";
import { IBoardgameMeepley } from "./boardgames/IBoardgame";

export interface IUser {
  id: number;
  email: string;
  name: string;
  username: string;
  provider_name: string | null;
  provider_token: string | null;
  title: string;
  avatar: string;
  calibrated: boolean;
  matches_played: number;
  favorite_days: [];
  updated_at: string;
  created_at: string;
  boardgame_skills_id: null;
  places_id: number;
  achievements: {
    users_id: number;
    achievements_id: number;
    created_at: string;
    updated_at: string;
    achievement: IAchievement;
  }[];
  cards: {
    users_id: number;
    cards_id: number;
    created_at: string;
    updated_at: string;
    card: ICard;
  }[];
  favorite_boardgames: {
    users_id: number;
    boardgames_id: number;
    created_at: string;
    updated_at: string;
    boardgame: IBoardgameMeepley;
  }[];
  matchroom: [];
  following: [];
  follower: [];
}

export type IUserKeys = keyof IUser;
