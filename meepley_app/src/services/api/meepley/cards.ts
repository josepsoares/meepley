import { AxiosResponse } from "axios";
import _axios from "./_meepleyInterceptor";

import { MEEPLEY_API_URL } from "../../../utils/constants/api";
import { addParamsToGetRequest } from "../../../utils/helpers/misc/addParamsToGetRequest";

const cardsRequests = {
  getCards: async (filters: any) => {
    // TODO - type param better instead of any
    const { name, collection, rarities, attributes } = filters;

    const additionalQueryStringParams = addParamsToGetRequest({
      name,
      collection,
      rarities,
      attributes,
    });

    const {
      data: cards,
    }: AxiosResponse<{
      data: ICard[];
      message: string;
    }> = await _axios.get(
      `${MEEPLEY_API_URL}/cards?${additionalQueryStringParams}`
    );

    return cards;
  },
  getCardRarities: async () => {
    const {
      data: cardRarities,
    }: AxiosResponse<{
      data: {
        id: number;
        name: string;
        chance: number;
        stock: number;
        gradient: string[];
        discount_value: null | number;
        updated_at: string;
        created_at: string;
      }[];
      message: string;
    }> = await _axios.get(`${MEEPLEY_API_URL}/cards/rarities`);

    return cardRarities;
  },
  getCardAttributes: async () => {
    const {
      data: cardAttributes,
    }: AxiosResponse<{
      data: {
        id: number;
        name: string;
        description: string;
        color: string;
        updated_at: string;
        created_at: string;
      }[];
      message: string;
    }> = await _axios.get(`${MEEPLEY_API_URL}/cards/attributes`);

    return cardAttributes;
  },
};

export default cardsRequests;
