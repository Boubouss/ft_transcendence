import {
	createElement,
	navigateTo,
	useEffect,
	useState,
} from "#src/core/framework.ts";
import Modal from "#src/components/Modals/Modal.ts";
import FormAuth from "#src/components/Forms/FormAuth/FormAuth.ts";
import DropdownLang from "#src/components/Dropdowns/DropdownLang/DropdownLang.ts";
import Form2FA from "#src/components/Forms/Form2FA/Form2FA.ts";
import Button from "#src/components/Buttons/Button.ts";
import DropdownUser from "#src/components/Dropdowns/DorpdownUser/DropdownUser.ts";
import { handleAutoConnect } from "#src/requests/authRequest.ts";
import {
	btn_menu_container,
	btn_modal_container,
	dropdown_container,
	home_background,
} from "./style";
import { btn_modal, btn_nav } from "#src/components/Buttons/style.ts";
import { setStorage } from "#src/services/data.ts";

const Home = () => {
	const [modalAuth, setModalAuth] = useState(false);
	const [modal2FA, setModal2FA] = useState(false);
	const [user, setUser] = useState<{} | null>(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("token");
		const id = urlParams.get("id");

		if (id && token) {
			setStorage(localStorage, "transcendence_token", { token, id });
			window.history.replaceState({}, "", "/");
		}
	}, []);

	useEffect(async () => {
		await handleAutoConnect(setUser);
	}, []);

	return createElement(
		"div",
		{ id: "home", class: home_background },
		createElement(
			"div",
			{ class: btn_menu_container },
			Button({
				children: "Local",
				attr: { class: btn_nav, onClick: () => navigateTo("/lobby") },
			}),
			user
				? Button({
						children: "Multiplayer",
						attr: { class: btn_nav, onClick: () => navigateTo("/lobby") },
				  })
				: createElement("div", { class: `hidden` })
		),
		createElement("div", { class: dropdown_container }, DropdownLang({})),
		createElement(
			"div",
			{ class: btn_modal_container },
			user
				? DropdownUser({ state: { user, setUser } })
				: Button({
						children: "Sign in / Sign up",
						attr: { class: btn_modal, onClick: () => setModalAuth(!modalAuth) },
				  })
		),
		Modal(
			{ state: modalAuth, setter: setModalAuth },
			FormAuth({ setModal: setModalAuth, set2FA: setModal2FA, setUser })
		),
		Modal(
			{ state: modal2FA, setter: setModal2FA },
			Form2FA({
				setter: setUser,
				setterAuth: setModalAuth,
				setter2FA: setModal2FA,
			})
		)
	);
};

export default Home;
