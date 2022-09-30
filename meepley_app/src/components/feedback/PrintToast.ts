import { Toast } from "native-base";

interface IPrintToast {
  title: string;
  status: string;
  variant?: string;
  dur?: number;
  description?: string;
}

const PrintToast = ({
  title,
  status,
  variant,
  dur = 5000,
  description,
}: IPrintToast) => {
  return Toast.show({
    title: title,
    description: description || undefined,
    accessibilityAnnouncement: title,
    status: status,
    variant: "subtle",
    duration: dur,
    style: {
      width: "95%",
      bottom: -38.5,
    },
  });
};

export default PrintToast;
