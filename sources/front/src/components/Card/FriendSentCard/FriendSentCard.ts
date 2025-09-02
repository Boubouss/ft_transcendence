import Card from "#components/Card/Card.ts";
import { createElement } from "#core/render.ts";
import _ from "lodash";
import { friend_card } from "./style";
import type { Friend } from "#types/user.ts";
import { useAvatar } from "#hooks/useAvatar.ts";

const FriendSentCard = (props: Friend) => {
  const { name, avatar, updated_at } = props;
  return Card(
    {
      class: friend_card,
    },
    createElement("img", {
      src: useAvatar(avatar, updated_at),
      class: "h-[50px] w-[50px] rounded-[50px]",
    }),
    createElement("span", { class: "text-xl" }, name)
  );
};

export default FriendSentCard;
