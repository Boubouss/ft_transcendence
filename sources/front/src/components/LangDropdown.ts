import useDropdown from "#hooks/useDropdown.ts";

const LangDropdown = () => {
  const dropdown = document.createElement("div");

  const setup = () => {
    useDropdown(
      dropdown.querySelector<HTMLButtonElement>("#dropdown-button")!,
      dropdown.querySelector<HTMLDivElement>("#dropdown-menu")!,
    );

    return dropdown;
  };

  dropdown.innerHTML = `
		<div id="dropdown">
			<button
				type="button"
				id="dropdown-button"
				class="py-[7px] px-[14px] border-solid border-2 border-black rounded-xl bg-[#FF9704] text-white text-4xl hover:text-black"
			>
				Test
			</button>
			<div id="dropdown-menu" class="absolute mt-[5px] border-solid border-2 border-black rounded-xl bg-[#FF9704] text-white text-2xl text-center">
				<div class="flex py-[7px] px-[14px] items-center justify-center hover:text-black">TEST 1</div>
				<div class="flex py-[7px] px-[14px] items-center justify-center hover:text-black">TEST 1</div>
				<div class="flex py-[7px] px-[14px] items-center justify-center hover:text-black">TEST 1</div>
			</div>
		</div>
  `;

  return setup();
};

export default LangDropdown;
