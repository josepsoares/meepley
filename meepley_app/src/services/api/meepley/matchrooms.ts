import axios, { AxiosResponse } from "axios";
import _axios from "./_meepleyInterceptor";

import { MEEPLEY_API_URL } from "../../../utils/constants/api";
import { addParamsToGetRequest } from "../../../utils/helpers/misc/addParamsToGetRequest";

import { IMatchroom } from "../../../ts/interfaces/IMatchroom";

const matchroomsRequests = {
  createMatchroom: async (matchroomInfo: any) => {
    try {
      const { data }: AxiosResponse<{ data: IMatchroom[]; message: string }> =
        await _axios.post(`${MEEPLEY_API_URL}/matchrooms/`, matchroomInfo);

      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw { message: err.message, status: err.response?.status };
      } else {
        throw { message: "An unexpected error occurred", status: 500 };
      }
    }
  },
  getMatchrooms: async (filters: any) => {
    // TODO - finish the filtering implementation
    const {} = filters;

    const additionalQueryStringParams = addParamsToGetRequest({});

    try {
      const {
        data: matchrooms,
      }: AxiosResponse<{ data: IMatchroom[]; message: string }> =
        await _axios.get(
          `${MEEPLEY_API_URL}/matchrooms?${additionalQueryStringParams}`
        );
      return matchrooms;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw {
          message: err?.response?.data.message,
          status: err.response?.status,
        };
      } else {
        throw { message: "An unexpected error occurred", status: 500 };
      }
    }
  },
  getUserMatchrooms: async (userId: number) => {
    try {
      const {
        data: matchrooms,
      }: AxiosResponse<{ data: IMatchroom[]; message: string }> =
        await _axios.get(`${MEEPLEY_API_URL}/matchrooms/user/${userId}`);
      return matchrooms;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw { message: err.message, status: err.response?.status };
      } else {
        throw { message: "An unexpected error occurred", status: 500 };
      }
    }
  },
  getRecommendedMatchrooms: async () => {
    const { data } = await _axios.get(
      `${MEEPLEY_API_URL}/matchrooms/recommended`
    );
    return data as IMatchroom[];
  },
  getDivergentMatchrooms: async () => {
    const { data } = await _axios.get(
      `${MEEPLEY_API_URL}/matchrooms/divergent`
    );
    return data as IMatchroom[];
  },
  getMatchroom: async (id: number) => {
    const { data: matchroom } = await _axios.get(
      `${MEEPLEY_API_URL}/matchrooms/${id}`
    );

    return matchroom.data as IMatchroom;
  },
  update: async (matchroomId: number, data: any) => {
    const { data: matchroom } = await _axios.put(
      `${MEEPLEY_API_URL}/matchrooms/${matchroomId}`,
      data
    );

    return matchroom.data as IMatchroom;
  },
  enterMatchroom: async (matchroomId: number, userId: number) => {
    const { data } = await _axios.get<{ message: string }>(
      `${MEEPLEY_API_URL}/matchrooms/enter?${addParamsToGetRequest({
        matchroom_id: matchroomId,
        user_id: userId,
      })}`,
      {}
    );

    return data.message;
  },
  enterMatchroomViaCode: async (code: string, userId: number) => {
    const { data } = await _axios.post<{ data: IMatchroom; message: string }>(
      `${MEEPLEY_API_URL}/matchrooms/enter?${
        (addParamsToGetRequest({
          user_id: userId,
        }),
        { code })
      }`
    );

    return data;
  },
  abandonMatchroom: async (matchroomId: number, userId: number) => {
    const { data } = await _axios.get<{ message: string }>(
      `${MEEPLEY_API_URL}/matchrooms/abandon?${addParamsToGetRequest({
        matchroom_id: matchroomId,
        user_id: userId,
      })}`,
      {}
    );

    return data.message;
  },
  deleteMatchroom: async (id: number) => {
    const { data } = await _axios.delete<{ message: string }>(
      `${MEEPLEY_API_URL}/matchrooms/${id}`
    );

    return data.message;
  },
  checkUserMatchroomFeedback: async (id: number) => {
    const {
      data: matchroomToEvaluate,
    }: AxiosResponse<{
      data: IMatchroom;
      message: string;
    }> = await _axios.get(`${MEEPLEY_API_URL}/matchrooms/check-feedback/${id}`);

    return matchroomToEvaluate;
  },
  addUserMatchroomFeedback: async (feedbackData: {
    userId: number;
    matchroomId: number;
    placeId: number;
    rating: number;
  }) => {
    const {
      data: matchroomToEvaluate,
    }: AxiosResponse<{
      message: string;
    }> = await _axios.post(`${MEEPLEY_API_URL}/matchrooms/feedback`, {
      user_id: feedbackData.userId,
      matchroom_id: feedbackData.matchroomId,
      place_id: feedbackData.placeId,
      rating: feedbackData.rating,
    });

    return matchroomToEvaluate;
  },
};

export default matchroomsRequests;
