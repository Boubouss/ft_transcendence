export function renderOneVOne() {
	const appRoot = document.getElementById("app-root");
	if (!appRoot) return;

	appRoot.innerHTML = "";

	const app = document.createElement("div");

	app.className = `
	relative
	h-screen
	w-screen
	bg-orange-400
	flex
	justify-center
	items-center

	`;

	const content_canvas =  document.createElement("div");
	content_canvas.className = `bg-green-400
	w-full
	h-[80%]
	flex
	justify-center
	items-center`;
	content_canvas.id = "content_canvas";

	const canvas = document.createElement("canvas");

	canvas.id = "gameCanvas";

	canvas.className = `bg-red-400`;

	content_canvas.appendChild(canvas);
	app.appendChild(content_canvas);
	appRoot.appendChild(app);
}
