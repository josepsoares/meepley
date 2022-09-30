import { proxy } from "valtio";

import { IBgCategoryMechanic } from "../../ts/interfaces/boardgames/IBgCategoryMechanic";
import { IPlaceType } from "../../ts/interfaces/IPlaceType";

const calibrationStore = proxy<{
  selectedBgSkill: { name: string; id: number } | null;
  selectedCategories: IBgCategoryMechanic[];
  selectedPlaceTypes: IPlaceType[];
  selectedDays: string[];
}>({
  selectedBgSkill: null,
  selectedCategories: [],
  selectedPlaceTypes: [],
  selectedDays: [],
});

export default calibrationStore;
