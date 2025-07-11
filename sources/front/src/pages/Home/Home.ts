import ButtonNavigation from "#components/Buttons/ButtonNavigation/ButtonNavigation.ts";
import ButtonModal from "#components/Buttons/ButtonModal/ButtonModal.ts";
import ModalAuth from "#components/Modals/ModalAuth/ModalAuth.ts";
import { useState } from "#core/hooks/useState.ts";
import { createElement } from "#core/render.ts";
import {
	btn_menu_container,
	btn_modal_container,
	dropdown_container,
	home_background,
} from "./style";
import DropdownLang from "#components/Dropdowns/DropdownLang/DropdownLang.ts";
import { useEffect } from "#core/hooks/useEffect.ts";

const Home = () => {
	const [modal, setModal] = useState(false);

	useEffect(() => {
		console.log("Auto connexion...");
	}, []);

	return createElement(
		"div",
		{ id: "home", class: home_background },
		createElement(
			"div",
			{ class: btn_menu_container },
			ButtonNavigation("Local", "/local"),
			ButtonNavigation("Multiplayer", "/multiplayer"),
			ButtonNavigation("Career", "/stats"),
		),
		createElement("div", { class: dropdown_container }, DropdownLang()),
		createElement(
			"div",
			{ class: btn_modal_container },
			ButtonModal("Sign in / Sign up", modal, setModal),
		),
		ModalAuth(modal, setModal),
	);
};

export default Home;
