import { AxiosResponse } from "axios";
import _axios from "./_meepleyInterceptor";

import { MEEPLEY_API_URL } from "../../../utils/constants/api";
import { addParamsToGetRequest } from "../../../utils/helpers/misc/addParamsToGetRequest";

const achievementsRequests = {
  getAchievements: async (filters: any) => {
    // TODO - type param better instead of any
    const additionalQueryStringParams = addParamsToGetRequest(filters);

    const {
      data: achievements,
    }: AxiosResponse<{
      data: IAchievement[];
      message: string;
    }> = await _axios.get(
      `${MEEPLEY_API_URL}/achievements?${additionalQueryStringParams}`
    );

    return achievements;
  },
  getAchievementsTypes: async () => {
    const {
      data: achievementsTypes,
    }: AxiosResponse<{
      data: {
        id: number;
        name: string;
        icon: string;
        updated_at: string;
        created_at: string;
      }[];
      message: string;
    }> = await _axios.get(`${MEEPLEY_API_URL}/achievements/types`);

    return achievementsTypes;
  },
  getAchievementsDifficulties: async () => {
    const {
      data: achievementsDifficulties,
    }: AxiosResponse<{
      data: {
        id: number;
        name: string;
        color: string;
        updated_at: string;
        created_at: string;
      }[];
      message: string;
    }> = await _axios.get(`${MEEPLEY_API_URL}/achievements/difficulties`);

    return achievementsDifficulties;
  },
};

export default achievementsRequests;
