export function renderOneVOne() {
	const appRoot = document.getElementById("app-root");
	if (!appRoot) return;

	appRoot.innerHTML = "";

	const app = document.createElement("div");

	app.className = `
	relative
	h-screen
	w-screen
	flex
	justify-center
	items-center

	`;

	const content_canvas =  document.createElement("div");
	content_canvas.className = ` relative
	w-full
	h-full
	flex
	bg-orange-200

	justify-center
	items-center`;
	content_canvas.id = "content_canvas";

	const canvas = document.createElement("canvas");

	canvas.id = "gameCanvas";

	const ScorePOne = document.createElement("div");
	ScorePOne.id = "score_p_1";

	ScorePOne.className = `flex items-center justify-center  font-jaro  absolute rounded-[20px] text-7xl text-white top-[10%] left-[10%] bg-black h-[10%] w-[5%] `;

	ScorePOne.style.fontFamily = `font-jaro`;

	const ScorePTwo = document.createElement("div");
	ScorePTwo.id = "score_p_2";

	ScorePTwo.className = `flex items-center justify-center  absolute rounded-[20px] top-[10%] text-7xl text-white right-[10%] bg-black h-[10%] w-[5%] `;
	ScorePTwo.style.fontFamily = `font-jaro`;


	content_canvas.appendChild(ScorePOne);
	content_canvas.appendChild(ScorePTwo);
	content_canvas.appendChild(canvas);
	app.appendChild(content_canvas);
	appRoot.appendChild(app);
}
