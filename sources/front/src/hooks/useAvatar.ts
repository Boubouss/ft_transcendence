import { API_USER_ROUTES } from "#services/data.ts";
import _ from "lodash";

export const useAvatar = (avatar: string | null | undefined) =>  {
  if (!avatar || _.isEmpty(avatar)) {
    return "/images/avatar_1.jpg";
  }

  return (
    import.meta.env.VITE_API_USER +
    API_USER_ROUTES.DOWNLOAD_AVATAR +
    `/` +
    avatar +
    "?t=" +
    Date.now().toString()
  );
};
