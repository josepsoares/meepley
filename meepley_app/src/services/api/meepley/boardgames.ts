import axios, { AxiosResponse } from "axios";

import _axios from "./_meepleyInterceptor";
import { MEEPLEY_API_URL } from "../../../utils/constants/api";
import { addParamsToGetRequest } from "../../../utils/helpers/misc/addParamsToGetRequest";

import { IBoardgameMeepley } from "../../../ts/interfaces/boardgames/IBoardgame";
import { IBgCategoryMechanic } from "../../../ts/interfaces/boardgames/IBgCategoryMechanic";
import { IBgSkill } from "../../../ts/interfaces/boardgames/IBgSkills";

const boardgamesRequests = {
  getBoardgame: async (id: number) => {
    const {
      data: bg,
    }: AxiosResponse<{ data: IBoardgameMeepley; message: string }> =
      await axios.get(`${MEEPLEY_API_URL}/bgs/${id}`);

    return bg;
  },
  getBoardgameCategories: async () => {
    const {
      data: bgCategories,
    }: AxiosResponse<{ data: IBgCategoryMechanic[]; message: string }> =
      await axios.get(`${MEEPLEY_API_URL}/bgs/categories`);

    return bgCategories;
  },
  getBoardgameMechanics: async () => {
    const {
      data: bgMechanics,
    }: AxiosResponse<{ data: IBgCategoryMechanic[]; message: string }> =
      await axios.get(`${MEEPLEY_API_URL}/bgs/mechanics`);

    return bgMechanics;
  },
  getBoardgameSkills: async () => {
    const {
      data: bgSkills,
    }: AxiosResponse<{ data: IBgSkill[]; message: string }> = await axios.get(
      `${MEEPLEY_API_URL}/bgs/skills`
    );

    return bgSkills;
  },
  updateFavoriteBoardgame: async (bgId: number) => {
    const {
      data: favoriteBoardgame,
    }: AxiosResponse<{
      action: string;
      data: IBoardgameMeepley[];
      message: string;
    }> = await _axios.put(`${MEEPLEY_API_URL}/users/bg/${bgId}`);

    return favoriteBoardgame;
  },
  getBoardgamesList: async (pageParam: number, name: string, filters: any) => {
    const {
      categories,
      mechanics,
      skills,
      nrMaxPlayers,
      nrMinPlayers,
      order_by,
      order,
    } = filters;

    const additionalQueryStringParams = addParamsToGetRequest({
      name,
      categories,
      mechanics,
      skills,
      max_players: nrMaxPlayers,
      min_players: nrMinPlayers,
      order_prop: order_by,
      order_type: order,
    });

    // console.log("ADDITIONAL PARAMS =>", additionalQueryStringParams);

    const {
      data: bgsList,
    }: AxiosResponse<{
      data: IBoardgameMeepley[];
      message: string;
      metadata: { next_id: number };
    }> = await axios.get(
      `${MEEPLEY_API_URL}/bgs?cursor=${pageParam}&take=30&${additionalQueryStringParams}`
    );

    // TODO
    //* add here the function to add stuff via query string etc. order_by=rank&ascending=false

    return bgsList;
  },
};

export default boardgamesRequests;
