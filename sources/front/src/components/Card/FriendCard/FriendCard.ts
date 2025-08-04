import Card from "#components/Card/Card.ts";
import { createElement } from "#core/render.ts";
import _ from "lodash";
import { friend_card, friend_card_active, friend_card_inactive } from "./style";
import { handleDeleteFriend } from "#sockets/Friends/request.ts";
import type { Friend, Friendship } from "#types/user.ts";

const FriendCard = (props: {
  friend: Friend & { active: boolean };
  state: {
    getter: Friendship | null;
    setter: (toSet: Friendship | null) => void;
    socket?: WebSocket | null;
  };
}) => {
  const { state, friend: target } = props;
  const { name, avatar, active } = props.friend;
  return Card(
    {
      class: friend_card + (active ? friend_card_active : friend_card_inactive),
    },
    createElement("img", {
      src: _.isEmpty(avatar) ? "/images/avatar_1.jpg" : avatar,
      class: "h-[50px] w-[50px] rounded-[50px]",
    }),
    createElement("span", { class: "text-xl" }, name),
    createElement("img", {
      class: "h-[20px] w-[20px] cursor-pointer",
      src: "/icons/decline.png",
      onClick: () => handleDeleteFriend({ target, state }),
    })
  );
};

export default FriendCard;
