import ButtonMenu from "#src/components/Buttons/ButtonMenu/ButtonMenu.ts";
import ButtonModal from "#src/components/Buttons/ButtonModal/ButtonModal.ts";
import ModalConnexion from "#src/components/Modals/ModalConnexion/ModalConnexion.ts";
import { useState } from "#src/core/hooks/useState.ts";
import { createElement } from "#src/core/render.ts";
import {
	btn_menu_container,
	btn_modal_container,
	home_background,
} from "./style";

const Home = () => {
	const [modal, setModal] = useState(false);

	return createElement(
		"div",
		{ id: "home", class: home_background },
		createElement(
			"div",
			{ class: btn_menu_container },
			ButtonMenu("Local", "/local"),
			ButtonMenu("Multiplayer", "/lobby"),
			ButtonMenu("Career", "/stats")
		),
		createElement(
			"div",
			{ class: btn_modal_container },
			ButtonModal("Sign in / Sign up", modal, setModal)
		),
		ModalConnexion(modal, setModal)
	);
};

export default Home;
