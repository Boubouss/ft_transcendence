import { createElement } from "#core/framework.ts";

const Multiplayer = () => {
	// const [count, setCount] = useState(0);
	// const [count2, setCount2] = useState(0);
	//
	// function handleClick() {
	// 	navigateTo("/404");
	// }
	//
	// function handleClick2() {
	// 	setCount2(count2 + 1);
	// }
	//
	// useEffect(() => {
	// 	setCount(1);
	// 	setCount(2);
	// 	setCount(3);
	// }, []);
	//
	// useEffect(() => {
	// 	setCount2(1);
	// 	setCount2(2);
	// }, []);
	return createElement("div", { id: "multiplayer" });
};

export default Multiplayer;
