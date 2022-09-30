import { AxiosResponse } from "axios";
import _axios from "./_meepleyInterceptor";

import { MEEPLEY_API_URL } from "../../../utils/constants/api";
import { addParamsToGetRequest } from "../../../utils/helpers/misc/addParamsToGetRequest";

import { IPlace } from "../../../ts/interfaces/IPlace";
import { IPlaceType } from "../../../ts/interfaces/IPlaceType";

const placesRequests = {
  getPlaces: async (filters: any) => {
    // TODO - finish the filtering implementation

    const {} = filters;

    const additionalQueryStringParams = addParamsToGetRequest({});

    const {
      data: places,
    }: AxiosResponse<{
      data: IPlace[];
      message: string;
    }> = await _axios.get(
      `${MEEPLEY_API_URL}/places?${additionalQueryStringParams}`
    );

    return places;
  },
  getPlaceTypes: async () => {
    const {
      data: placeTypes,
    }: AxiosResponse<{ data: IPlaceType[]; message: string }> =
      await _axios.get(`${MEEPLEY_API_URL}/places/types`);

    return placeTypes;
  },
  updatePlace: async () => {
    // TODO - finish the update place feature for establishment accounts

    const { data } = await _axios.get(`${MEEPLEY_API_URL}/places/types`, {});
    return data.message;
  },
};

export default placesRequests;
