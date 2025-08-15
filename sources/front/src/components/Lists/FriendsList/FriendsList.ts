import FriendCard from "#components/Card/FriendCard/FriendCard.ts";
import { createElement } from "#core/render.ts";
import type { Friend, Friendship } from "#types/user.ts";
import _ from "lodash";
import List from "../List";
import FormFriend from "#components/Forms/FormFriend/FormFriend.ts";
import { list_friends } from "../style";
import { useLanguage } from "#hooks/useLanguage.ts";
import type { ComponentAttr } from "#core/framework.ts";

const FriendsList = (props: {
  getter: Friendship | null;
  setter: (toSet: Friendship | null) => void;
  socket?: WebSocket | null;
  attr?: ComponentAttr;
}) => {
  const { getter: friends } = props;

  const default_attr = { class: list_friends };
  const attr = { ...default_attr, ...props.attr };

  const online: Friend[] = friends ? friends?.online : [];
  const offline: Friend[] = friends ? friends?.offline : [];

  return createElement(
    "div",
    attr,
    createElement("h2", { class: "text-[35px]" }, useLanguage("friend_list")),
    createElement(
      "div",
      { class: "overflow-auto w-full h-full flex flex-col gap-[20px]" },
      List(
        { attr: { class: "w-full flex flex-col gap-[20px]" } },
        FriendCard,
        online?.map((elem) => ({
          friend: { ...elem, active: true },
          state: props,
        }))
      ),
      List(
        { attr: { class: "w-full flex flex-col gap-[20px]" } },
        FriendCard,
        offline?.map((elem) => ({
          friend: { ...elem, active: false },
          state: props,
        }))
      )
    ),
    FormFriend(props)
  );
};

export default FriendsList;
