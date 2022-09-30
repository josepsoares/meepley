import { IBgCategoryMechanic } from "./IBgCategoryMechanic";

export interface IBoardgameMeepley {
  id: number;
  name: string;
  short_description: string | null;
  description: string | null;
  year_released: number | null;
  rank: number | null;
  thumbnail: string;
  image: string;
  min_players: number | null;
  max_players: number | null;
  min_age: number | null;
  bgg_link: string;
  bgg_id: number;
  bgg_rating: number;
  official_url: string | null;
  avg_playtime: string | null;
  designers: string[];
  artists: string[];
  top_files: any[];
  video_tutorial: string | null;
  video_review: string | null;
  difficulty: string | null;
  owned: number | null;
  fans: number | null;
  nr_of_ratings: number | null;
  categories: {
    boardgames_id: number;
    boardgame_categories_id: number;
    updated_at: string;
    created_at: string;
    category: IBgCategoryMechanic;
  }[];
  mechanics: {
    boardgames_id: number;
    boardgame_mechanics_id: number;
    updated_at: string;
    created_at: string;
    mechanic: IBgCategoryMechanic;
  }[];
}
