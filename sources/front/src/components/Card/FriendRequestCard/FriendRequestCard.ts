import Card from "#components/Card/Card.ts";
import { createElement } from "#core/render.ts";
import type { Friend, Friendship } from "#types/user.ts";
import _ from "lodash";
import { friend_card } from "./style";
import Button from "#components/Buttons/Button.ts";
import {
  handleAcceptFriendRequest,
  handleDeclineFriendRequest,
} from "#sockets/Friends/request.ts";

const FriendRequestCard = (props: {
  friend: Friend;
  state: {
    getter: Friendship | null;
    setter: (toSet: Friendship | null) => void;
    socket?: WebSocket | null;
  };
}) => {
  const { state, friend: target } = props;
  const { name, avatar } = props.friend;
  return Card(
    {
      class: friend_card,
    },
    createElement("img", {
      src: _.isEmpty(avatar) ? "/images/avatar_1.jpg" : avatar,
      class: "h-[50px] w-[50px] rounded-[50px]",
    }),
    createElement("span", { class: "text-xl" }, name),
    createElement(
      "div",
      { class: "flex gap-[20px]" },
      Button({
        children: createElement("img", {
          class: "h-[35px] w-[35px] cursor-pointer",
          src: "/icons/accept.png",
        }),
        attr: {
          class: "",
          onClick: () => handleAcceptFriendRequest({ target, state }),
        },
      }),
      Button({
        children: createElement("img", {
          class: "h-[20px] w-[20px] cursor-pointer",
          src: "/icons/decline.png",
        }),
        attr: {
          class: "",
          onClick: () => handleDeclineFriendRequest({ target, state }),
        },
      })
    )
  );
};

export default FriendRequestCard;
