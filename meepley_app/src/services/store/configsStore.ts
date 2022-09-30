import { proxy, subscribe } from "valtio";
import { storeDataObject } from "../localStorage";

export const configsStore = proxy<{
  fontSize: number;
  contrast: string;
  notifications: boolean;
  didCompleteTour: boolean;
  setFontSize: (val: number) => void;
  setContrast: (val: string) => void;
  setNotifications: () => void;
}>({
  fontSize: 16,
  contrast: "normal",
  notifications: false,
  didCompleteTour: false,
  setFontSize: (val: number) => {
    configsStore.fontSize = val;
  },
  setNotifications: () => {
    configsStore.notifications = !configsStore.notifications;
  },
  setContrast: (val: string) => {
    configsStore.contrast = val;
  },
});

subscribe(configsStore, async () => {
  await storeDataObject(configsStore, "configs-store");
});
