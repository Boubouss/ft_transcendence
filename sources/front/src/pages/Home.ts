import LangDropdown from "#components/LangDropdown.ts";

// <div id="home" class="w-full h-full bg-[url('images/main_background.jpg')] bg-cover bg-center sm:bg-[length:110%_160%] bg-[length:150%_180%]">
const Home = () => {
  const home = document.createElement("div");

  const setupHome = () => {
    home.id = "home";
    home.className = "w-full h-full";

    home
      .querySelector<HTMLButtonElement>("#dropdown-container")!
      .appendChild(LangDropdown());

    return home;
  };

  home.innerHTML = `
		<div class="flex p-8 justify-between">
			<div id="dropdown-container">
			</div>
			<div class="flex gap-2">
				<button
					type="button"
					class="py-[7px] px-[14px] border-solid border-2 border-black rounded-xl bg-[#FF9704] text-white text-4xl hover:text-black"
				>
					Login
				</button>
			</div>
		</div>
	`;

  return setupHome();
};

export default Home;
