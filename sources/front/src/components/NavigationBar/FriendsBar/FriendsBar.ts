import Button from "#components/Buttons/Button.ts";
import FriendsContent from "#components/Friends/FriendsContent/FriendsContent.ts";
import Modal from "#components/Modals/Modal.ts";
import { useState } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import type { Friendship } from "#types/user.ts";

const FriendsBar = (props: {
  getter: Friendship | null;
  setter: (toSet: Friendship | null) => void;
  socket?: WebSocket | null;
}) => {
  const [modalFriend, setModalFriend] = useState(false);

  return createElement(
    "div",
    { class: "flex h-[100px] z-2" },
    Button({
      children: createElement("img", {
        src: "/icons/friends_icon.png",
        class: "h-full cursor-pointer invert",
      }),
      attr: {
        onClick: () => setModalFriend(true),
      },
    }),
    Modal({ state: modalFriend, setter: setModalFriend }, FriendsContent(props))
  );
};

export default FriendsBar;
