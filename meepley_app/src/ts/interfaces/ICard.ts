interface ICard {
  id: number;
  name: string;
  image: string;
  description: string;
  external_url: null;
  updated_at: string;
  created_at: string;
  attributes: {
    cards_id: number;
    card_attributes_id: number;
    updated_at: string;
    created_at: string;
    attribute: {
      id: number;
      name: string;
      color: string;
      updated_at: string;
      created_at: string;
    };
  }[];
  card_rarities_id: number;
  rarity: {
    id: number;
    name: string;
    chance: number;
    stock: number;
    gradient: string[];
    discount_value: null | number;
    updated_at: string;
    created_at: string;
  };
}
