export function renderOneVOne() {
	const appRoot = document.getElementById("app-root");
	if (!appRoot) return;
	appRoot.innerHTML = "";

	const app = document.createElement("div");
	app.className = `
	h-screen
	w-screen
	flex
	justify-center
	items-center
	bg-orange-200
    `;

	const content_canvas =  document.createElement("div");
	content_canvas.id = "content_canvas";
	content_canvas.className = `
	justify-between
	items-center
    p-[2px]
    bg-white
    grid
    grid-rows-2
    grid-cols-2
	grid-rows-[auto_1fr]
    grid-flow-row-dense
    grid-flow-col-dense
    gap-[2px]
    `;

	const canvas = document.createElement("canvas");
	canvas.id = "gameCanvas";
    canvas.classList.add("col-span-2","col-1","row-2");

    const scoreLabelClasses = `
    bg-black
    text-white
    text-center
    font-bold
    `;
	const scoreDivL = document.createElement("div");
	scoreDivL.id = "scoreLeft";
	scoreDivL.style.fontFamily = `font-jaro`;
    scoreDivL.className = scoreLabelClasses;
    scoreDivL.classList.add("col-span-1","col-1","row-1");

	const scoreDivR = document.createElement("div");
	scoreDivR.id = "scoreRight";
	scoreDivR.style.fontFamily = `font-jaro`;
    scoreDivR.className = scoreLabelClasses;
    scoreDivR.classList.add("col-span-1","col-2","row-1");

	appRoot.appendChild(app);
	app.appendChild(content_canvas);
    content_canvas.appendChild(scoreDivL);
    content_canvas.appendChild(scoreDivR);
    content_canvas.appendChild(canvas);
}
