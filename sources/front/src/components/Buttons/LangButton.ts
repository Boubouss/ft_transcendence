import { createCustomButton } from "./CustomButton";
import * as langStorage from "@utils/langStorage"

export function createLangDropdown(): HTMLDivElement {
  const langContainer = document.createElement("div");
  langContainer.className = "hidden sm:block absolute top-10 left-10";

  const langButton = createCustomButton({
    text: langStorage.getLang().toUpperCase() || "ES",
    textColor: "text-white",
    fontStyle: "font-jaro font-semibold",
    fontSizeClass: "text-4xl",
    width: "120px",
    height: "80px",
    position: "",
  });

  const dropdown = document.createElement("div");
  dropdown.className =
    "hidden absolute mt-4 w-[120px] bg-orange-500 rounded-[20px] shadow-md z-50 border-2";
  dropdown.style.top = "70px";

  const languages = ["fr", "en", "es"];
  languages.forEach((lang, index) => {
    const langOption = document.createElement("div");
    langOption.className =
      "px-4 py-2 text-white cursor-pointer font-semibold text-center hover:bg-orange-300";
    langOption.style.fontFamily = "'Jaro', sans-serif";

    if (index === 0) langOption.classList.add("rounded-t-[20px]");
    if (index === languages.length - 1)
      langOption.classList.add("rounded-b-[20px]");

    langOption.textContent = lang.toUpperCase();
    langOption.addEventListener("click", () => {
      langStorage.saveLang(lang);
    });
    dropdown.appendChild(langOption);
  });

  langButton.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  langContainer.appendChild(langButton);
  langContainer.appendChild(dropdown);

  return langContainer;
}
