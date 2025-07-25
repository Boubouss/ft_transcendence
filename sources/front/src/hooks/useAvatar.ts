import { API_USER_ROUTES } from "#services/data.ts";
import type { User } from "#types/user.ts";
import _ from "lodash";

export const useAvatar = (user: User | null | undefined) => {
	if (!user || _.isEmpty(user.avatar)) {
		return "/images/avatar_1.jpg";
	}

	return (
		import.meta.env.VITE_API_USER +
		API_USER_ROUTES.DOWNLOAD_AVATAR +
		`/` +
		user.avatar +
		"?t=" +
		Date.now().toString()
	);
};
