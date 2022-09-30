import { proxy } from "valtio";

import {
  initialBoardgamesFilter,
  initialMatchroomsFilter,
  initialPlacesFilter,
  initialCardsFilter,
  initialAchievementsFilter,
} from "../../utils/constants/initialFilters";

export const filtersStore = proxy({
  bgs: initialBoardgamesFilter,
  matchrooms: initialMatchroomsFilter,
  places: initialPlacesFilter,
  cards: initialCardsFilter,
  achievements: initialAchievementsFilter,
});
