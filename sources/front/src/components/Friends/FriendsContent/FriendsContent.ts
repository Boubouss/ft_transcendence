import {
  form_choice,
  form_choice_active,
  form_choice_container,
} from "#components/Forms/style.ts";
import FriendsRequestList from "#components/Lists/FriendRequestsList/FriendRequestsList.ts";
import FriendSentList from "#components/Lists/FriendSentList/FriendSentList.ts";
import FriendsList from "#components/Lists/FriendsList/FriendsList.ts";
import { useState } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import type { Friendship } from "#types/user.ts";

const FriendsContent = (props: {
  getter: Friendship | null;
  setter: (toSet: Friendship | null) => void;
  socket?: WebSocket | null;
}) => {
  const [toggleList, setToggleList] = useState<number>(0);

  return createElement(
    "div",
    { class: "flex flex-col h-full w-full p-[50px] " },
    createElement(
      "div",
      { class: form_choice_container },
      createElement(
        "div",
        {
          class: toggleList === 0 ? form_choice_active : form_choice,
          onClick: () => setToggleList(0),
        },
        useLanguage("friends")
      ),
      createElement(
        "div",
        {
          class: toggleList === 1 ? form_choice_active : form_choice,
          onClick: () => setToggleList(1),
        },
        useLanguage("requests")
      ),
      createElement(
        "div",
        {
          class: toggleList === 2 ? form_choice_active : form_choice,
          onClick: () => setToggleList(2),
        },
        useLanguage("sent")
      )
    ),
    FriendsList({
      ...props,
      attr: {
        class:
          "w-full h-full flex flex-col items-center pb-[20px] pt-[20px] gap-[10px] my-scrollbar" +
          (toggleList === 0 ? "" : " hidden"),
      },
    }),
    FriendsRequestList({
      ...props,
      attr: {
        class:
          "w-full h-full flex flex-col pb-[20px] pt-[20px] items-center my-scrollbar" +
          (toggleList === 1 ? "" : " hidden"),
      },
    }),
    FriendSentList({
      ...props,
      attr: {
        class:
          "w-full h-full flex flex-col pb-[20px] pt-[20px] items-center my-scrollbar" +
          (toggleList === 2 ? "" : " hidden"),
      },
    })
  );
};

export default FriendsContent;
