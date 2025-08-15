import { createElement } from "#core/render.ts";
import type { Friend, Friendship } from "#types/user.ts";
import _ from "lodash";
import List from "../List";
import { list_friends } from "../style";
import { useLanguage } from "#hooks/useLanguage.ts";
import type { ComponentAttr } from "#core/framework.ts";
import FriendSentCard from "#components/Card/FriendSentCard/FriendSentCard.ts";

const FriendSentList = (props: {
  getter: Friendship | null;
  setter: (toSet: Friendship | null) => void;
  socket?: WebSocket | null;
  attr?: ComponentAttr;
}) => {
  const { getter: friends } = props;

  const default_attr = { class: list_friends };
  const attr = { ...default_attr, ...props.attr };

  const sent: Friend[] = friends?.sent ?? [];

  return createElement(
    "div",
    attr,
    createElement("h2", { class: "text-[35px]" }, useLanguage("sent_list")),
    List(
      { attr: { class: "w-full flex flex-col gap-[20px]" } },
      FriendSentCard,
      sent
    )
  );
};

export default FriendSentList;
