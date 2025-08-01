import {
	createElement,
	navigateTo,
	useEffect,
	useState,
} from "#core/framework.ts";
import Modal from "#components/Modals/Modal.ts";
import FormAuth from "#components/Forms/FormAuth/FormAuth.ts";
import Form2FA from "#components/Forms/Form2FA/Form2FA.ts";
import Button from "#components/Buttons/Button.ts";
import { handleAutoConnect } from "#requests/authRequest.ts";
import { btn_menu_container, home_background, menu_container } from "./style";
import { btn_nav } from "#components/Buttons/style.ts";
import { getStorage, setStorage } from "#services/data.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";

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
					attr: { class: btn_nav, onClick: () => navigateTo("/local") },
				}),
				user &&
					Button({
						children: useLanguage("multiplayer"),
						attr: { class: btn_nav, onClick: () => navigateTo("/multiplayer") },
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
