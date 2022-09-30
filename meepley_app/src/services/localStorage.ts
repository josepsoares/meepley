import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (value: string, key: string) => {
  try {
    await AsyncStorage.setItem(`@${key}`, value);
  } catch (e) {
    // saving error
  }
};

const storeDataObject = async (value: Record<string, any>, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`@${key}`, jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(`@${key}`);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return e;
  }
};

const getDataObject = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`@${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return e;
  }
};

const removeValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(`@${key}`);
  } catch (e) {
    // remove error
  }
};

export { storeData, storeDataObject, getData, getDataObject, removeValue };
