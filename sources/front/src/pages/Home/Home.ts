import {
	createElement,
	navigateTo,
	useEffect,
	useState,
} from "#src/core/framework.ts";
import Modal from "#src/components/Modals/Modal.ts";
import FormAuth from "#src/components/Forms/FormAuth/FormAuth.ts";
import Form2FA from "#src/components/Forms/Form2FA/Form2FA.ts";
import Button from "#src/components/Buttons/Button.ts";
import { handleAutoConnect } from "#src/requests/authRequest.ts";
import { btn_menu_container, home_background, menu_container } from "./style";
import { btn_nav } from "#src/components/Buttons/style.ts";
import { getStorage, setStorage } from "#src/services/data.ts";
import { useLanguage } from "#src/services/language.ts";
import NavigationBar from "#src/components/NavigationBar/NavigationBar.ts";

const Home = () => {
	const [modalAuth, setModalAuth] = useState(false);
	const [modal2FA, setModal2FA] = useState(false);
	const [user, setUser] = useState<{} | null>(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("token");
		const id = urlParams.get("id");
		const configuration = getStorage(localStorage, "transcendence_conf");

		if (id && token) {
			setStorage(localStorage, "transcendence_conf", {
				token,
				id,
				lang: configuration?.lang ?? "FR",
			});
			window.history.replaceState({}, "", "/");
		}
	}, []);

	useEffect(async () => {
		await handleAutoConnect(setUser);
	}, []);

	return createElement(
		"div",
		{ id: "home", class: home_background },
		NavigationBar({
			userState: { user, setUser },
			modalState: { modalAuth, setModalAuth },
		}),
		createElement(
			"div",
			{ class: menu_container },
			createElement(
				"div",
				{ class: btn_menu_container },
				Button({
					children: useLanguage("local"),
					attr: { class: btn_nav, onClick: () => navigateTo("/lobby") },
				}),
				user &&
					Button({
						children: useLanguage("multiplayer"),
						attr: { class: btn_nav, onClick: () => navigateTo("/lobby") },
					})
			)
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
