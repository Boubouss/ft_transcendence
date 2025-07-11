import { createElement } from "#src/core/render.ts";
import { useState } from "#src/core/hooks/useState.ts";
import { useEffect } from "#src/core/hooks/useEffect.ts";
import { fetchAPI, getStorage, setStorage } from "#src/services/data.ts";
import ButtonNavigation from "#src/components/Buttons/ButtonNavigation/ButtonNavigation.ts";
import ButtonModal from "#src/components/Buttons/ButtonModal/ButtonModal.ts";
import DropdownLang from "#src/components/Dropdowns/DropdownLang/DropdownLang.ts";
import {
	btn_menu_container,
	btn_modal_container,
	dropdown_container,
	home_background,
} from "./style";
import Modal from "#src/components/Modals/Modal.ts";
import FormAuth from "#src/components/Forms/FormAuth/FormAuth.ts";

const Home = () => {
	const [modal, setModal] = useState(false);
	const [auth, setAuth] = useState(false);

	useEffect(async () => {
		const credentials: { id: string; token: string } = getStorage(
			localStorage,
			"transcendence_token"
		);
		if (
			credentials.token &&
			!getStorage(sessionStorage, "transcendence_user")
		) {
			const user = await fetchAPI(
				"https://localhost:3000/crud/user/" + credentials.id,
				{
					method: "GET",
					headers: { Authorization: `Bearer ` + credentials.token },
				}
			);
			if (user) {
				setStorage(sessionStorage, "transcendence_user", user);
				setAuth(true);
			}
		}
	}, []);

	return createElement(
		"div",
		{ id: "home", class: home_background },
		createElement(
			"div",
			{ class: btn_menu_container },
			ButtonNavigation({ text: "Local", path: "/lobby" }),
			auth
				? ButtonNavigation({ text: "Multiplayer", path: "/lobby" })
				: createElement("div", { class: `hidden` })
		),
		createElement("div", { class: dropdown_container }, DropdownLang({})),
		createElement(
			"div",
			{ class: btn_modal_container },
			ButtonModal({ text: "Sign in / Sign up", state: modal, setter: setModal })
		),
		Modal({ state: modal, setter: setModal }, FormAuth())
	);
};

export default Home;
