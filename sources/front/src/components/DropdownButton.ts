const DropdownButton = (
  button: HTMLButtonElement,
  dropdown: HTMLDivElement,
) => {
  let showMenu: boolean;

  const setShowMenu = (value: boolean) => {
    showMenu = value;

    if (!showMenu) {
      dropdown.classList.add("hidden");
    } else {
      dropdown.classList.remove("hidden");
    }
  };

  button.addEventListener("click", () => setShowMenu(!showMenu));

  setShowMenu(false);
};

export default DropdownButton;
