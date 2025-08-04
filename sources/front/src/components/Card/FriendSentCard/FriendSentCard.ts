import Card from "#components/Card/Card.ts";
import { createElement } from "#core/render.ts";
import _ from "lodash";
import { friend_card } from "./style";
import type { Friend } from "#types/user.ts";

const FriendSentCard = (props: Friend) => {
  const { name, avatar } = props;
  return Card(
    {
      class: friend_card,
    },
    createElement("img", {
      src: _.isEmpty(avatar)
        ? "../../../../public/images/avatar_1.jpg"
        : avatar,
      class: "h-[50px] w-[50px] rounded-[50px]",
    }),
    createElement("span", { class: "text-xl" }, name)
  );
};

export default FriendSentCard;
