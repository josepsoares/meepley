import { Share } from "react-native";

const onShare = async (message: string) => {
  try {
    const result = await Share.share({
      message:
        "React Native | A framework for building native apps using React",
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (err) {
    if (err instanceof Error) {
      alert(err);
    }
  }
};

export default onShare;

