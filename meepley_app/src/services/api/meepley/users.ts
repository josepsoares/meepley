import axios, { AxiosResponse } from "axios";
import { ImageInfo } from "expo-image-picker";
import { Platform } from "react-native";

import _axios from "./_meepleyInterceptor";
import authStore from "../../store/authStore";

import { MEEPLEY_API_URL } from "../../../utils/constants/api";
import { addParamsToGetRequest } from "../../../utils/helpers/misc/addParamsToGetRequest";

import { IUser } from "../../../ts/interfaces/IUser";
import { ICalibrateUser } from "../../../ts/interfaces/api/ICalibrateUser";
import { string } from "yup";

const usersRequests = {
  getUserProfile: async (id: number) => {
    const {
      data: userProfile,
    }: AxiosResponse<{ data: IUser; message: string }> = await _axios.get(
      `${MEEPLEY_API_URL}/users/${id}`
    );

    return userProfile;
  },
  updateUser: async (id: number, data: any) => {
    const {
      data: updatedUser,
    }: AxiosResponse<{ data: IUser; message: string }> = await _axios.put(
      `${MEEPLEY_API_URL}/users/${id}?${addParamsToGetRequest(data)}`
    );

    return updatedUser;
  },
  uploadAndUpdateUserAvatar: async (
    id: number,
    file: ImageInfo,
    fileName: string
  ) => {
    const data = new FormData();

    const splitFileName = fileName.split(".");
    const fileExtension = splitFileName[splitFileName.length - 1];

    data.append("file", {
      name: fileName,
      type: `${file.type}/${
        fileExtension === "jpg" ? "jpeg" : fileExtension
      }` as string,
      uri:
        Platform.OS === "android" ? file.uri : file.uri.replace("file://", ""),
    } as any);

    // * couldn't make this work with the axios interceptor
    // * so had to force a fetch here, probably need to downgrade axios version
    const newAvatar = await fetch(
      `${MEEPLEY_API_URL}/users/update/avatar/${id}`,
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const newAvatarRes: { avatar: string; message: string } =
      await newAvatar.json();

    return newAvatarRes;
  },
  calibrateUser: async (id: number, dataToUpdate: ICalibrateUser) => {
    const {
      data: updatedUser,
    }: AxiosResponse<{
      data: IUser[];
      message: string;
    }> = await _axios.post(
      `${MEEPLEY_API_URL}/users/calibrate/${id}`,
      dataToUpdate
    );

    return updatedUser;
  },
  deleteUser: async (id: number) => {
    const { data: deleteUser }: AxiosResponse<{ message: string }> =
      await _axios.delete(`${MEEPLEY_API_URL}/users/${id}}`);

    return deleteUser;
  },
  login: async (email: string, password: string) => {
    try {
      const {
        data,
      }: AxiosResponse<{
        data: { user: IUser; jwt: string };
        message: string;
      }> = await _axios.post(`${MEEPLEY_API_URL}/auth/login`, {
        email: email,
        password: password,
      });

      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw { message: err.message, status: err.response?.status };
      } else {
        throw { message: "An unexpected error occurred", status: 500 };
      }
    }
  },
  register: async (data: {
    place?: {} | null;
    email: string;
    username?: string;
    password: string;
  }) => {
    const {
      data: registerUser,
    }: AxiosResponse<{
      data: IUser[];
      message: string;
    }> = await _axios.post(
      `${MEEPLEY_API_URL}/auth/register?type=${data?.place ? "place" : "user"}`,
      data
    );

    return registerUser;
  },
  changeUserPassword: async (id: number, password: string) => {
    const {
      data: newUserPassword,
    }: AxiosResponse<{
      data: IUser[];
      message: string;
    }> = await _axios.post(`${MEEPLEY_API_URL}/auth/change-password/${id}`, {
      password,
    });

    return newUserPassword;
  },
};

export default usersRequests;
