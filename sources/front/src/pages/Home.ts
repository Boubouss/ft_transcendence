import {
	createElement,
	navigateTo,
	useState,
	useEffect,
} from "#core/framework";

const Home = () => {
	const [count, setCount] = useState(0);
	const [count2, setCount2] = useState(0);

	function handleClick() {
		navigateTo("/404");
	}

	function handleClick2() {
		setCount2(count2 + 1);
	}

	useEffect(() => {
		setCount(1);
		setCount(2);
		setCount(3);
	}, []);

	useEffect(() => {
		setCount2(1);
		setCount2(2);
	}, []);

	return createElement(
		"div",
		{ id: "home" },
		createElement("h1", null, `Compteur: ${count}`),
		createElement("h1", null, `Compteur 2: ${count2}`),
		createElement("button", { onClick: handleClick }, "Incrémenter"),
		createElement("button", { onClick: handleClick2 }, "Incrémenter 2")
	);
};

export default Home;
