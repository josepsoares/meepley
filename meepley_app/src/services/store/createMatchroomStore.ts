import { proxy } from "valtio";
import { IBoardgameMeepley } from "../../ts/interfaces/boardgames/IBoardgame";
import { IPlace } from "../../ts/interfaces/IPlace";

export const createMatchroomStore = proxy<{
  place: null | IPlace;
  boardgames: IBoardgameMeepley[];
}>({
  place: null,
  boardgames: [],
});
