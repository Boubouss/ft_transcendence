// <div id="home" class="w-full h-full bg-[url('images/main_background.jpg')] bg-cover bg-center sm:bg-[length:110%_160%] bg-[length:150%_180%]">
const Home = () => {
  const home = document.createElement("div");

  const setupHome = () => {
    // DropdownButton(
    //   home.querySelector<HTMLButtonElement>("#dropdown-button")!,
    //   home.querySelector<HTMLDivElement>("#dropdown-menu")!,
    // );

    // home
    //   .querySelector<HTMLButtonElement>("#dropdown")!
    //   .replaceChildren(LangDropdown());

    return home;
  };

  home.innerHTML = `
		<div id="home" class="w-full h-full">
			<div class="flex p-8">
				<div id="dropdown-container" class="flex-start">
				</div>
			</div>
		</div>
	`;

  return setupHome();
};

export default Home;
