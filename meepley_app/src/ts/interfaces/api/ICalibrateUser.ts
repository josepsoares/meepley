export interface ICalibrateUser {
  calibrated: boolean;
  boardgame_skill?: { readonly name: string; readonly id: number };
  favorite_boardgame_categories?: readonly {
    readonly id: number;
    readonly name: string;
    readonly bgg_link: string;
    readonly bgg_id: number;
    readonly created_at: string;
    readonly updated_at: string;
  }[];
  favorite_days?: readonly string[];
  favorite_place_types?: readonly {
    readonly id: number;
    readonly name: string;
    readonly emoji: string;
    readonly created_at: string;
    readonly updated_at: string;
  }[];
}

