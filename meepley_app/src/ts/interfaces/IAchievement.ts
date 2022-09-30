interface IAchievement {
  id: number;
  name: string;
  requirement: string;
  updated_at: string;
  created_at: string;
  achievement_difficulties_id: number;
  achievement_types_id: number;
  secret: boolean;
  difficulty: {
    id: number;
    name: string;
    color: string;
    updated_at: string;
    created_at: string;
  };
  type: {
    id: number;
    name: string;
    icon: string;
    updated_at: string;
    created_at: string;
  };
}
