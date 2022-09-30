import { proxy, subscribe } from "valtio";
import { removeValue, getDataObject, storeDataObject } from "../localStorage";

import { IUser, IUserKeys } from "../../ts/interfaces/IUser";

const authStore = proxy<{
  hydrated: boolean;
  isAuth: boolean;
  isLoading: boolean;
  user: IUser | null;
  userIsInMatchroom: boolean;
  token: string | null;
  refreshToken: string | undefined;
  setAuth: (val: boolean, action: string) => void;
  updateUserProp: <K extends keyof IUser>(prop: K, val: any) => void;
  hydrateStore: () => void;
}>({
  hydrated: false,
  isAuth: false,
  isLoading: false,
  user: null,
  userIsInMatchroom: false,
  token: null,
  refreshToken: undefined,
  setAuth: async (val, action) => {
    authStore.isLoading = true;
    authStore.isAuth = val;

    if (action === "login") {
    } else {
      await removeValue("auth");

      authStore.user = null;
      authStore.token = null;
      authStore.isAuth = false;
      authStore.isLoading = false;
    }
  },
  updateUserProp: async (prop, val) => {
    if (authStore.user) {
      authStore.user[prop] = val;
    }
  },
  hydrateStore: async () => {
    const storedState = await getDataObject("auth");

    if (storedState) {
      authStore.isAuth = storedState.isAuth;
      authStore.user = storedState.user;
      authStore.token = storedState.token;
    }

    authStore.hydrated = true;
  },
});

subscribe(authStore, async () => {
  // console.log("SUBSCRIBED USER =>", authStore.user?.username);
  // console.log("SUBSCRIBED TOKEN =>", authStore.token);

  await storeDataObject(
    {
      isAuth: authStore.isAuth,
      user: authStore.user,
      token: authStore.token,
      userIsInMatchroom: authStore.userIsInMatchroom,
    },
    "auth"
  );
});

export default authStore;
