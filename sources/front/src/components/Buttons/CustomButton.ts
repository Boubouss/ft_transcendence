interface CustomButtonOptions {
  backgroundColor?: string;
  width?: string;
  height?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  position?: string;
  text?: string;
  imageUrl?: string;
  imageWidth?: string;  // ← Nouvelle option
  minWidth?: string;
  imageHeight?: string; // ← Nouvelle option
  fontStyle?: string;
  padding?: string;
  fontSizeClass?: string;
  onClick?: () => void;
}

export function createCustomButton(
  options: CustomButtonOptions
): HTMLButtonElement {
  const button = document.createElement("button");

  const classes = [
    options.position || "",
    options.backgroundColor || "bg-orange-500",
    options.textColor || "text-black",
    options.borderWidth || "border-2",
    options.borderColor || "border-black",
    options.borderRadius || "rounded-[20px]",
    options.fontStyle || "font-jaro",
    options.fontSizeClass || "text-lg",
    options.minWidth || "min-w-[100px]",
    options.padding || "",
    "font-bold",
    "flex",
    "items-center",
    "justify-center",
  ]
    .filter(Boolean)
    .join(" ");

  button.className = classes;

  if (options.width) button.style.width = options.width;
  if (options.height) button.style.height = options.height;

  if (options.imageUrl) {
    const img = document.createElement("img");
    img.src = options.imageUrl;
    img.alt = options.text || "button image";

    if (options.imageWidth) {
      img.style.width = options.imageWidth;
    } else {
      img.style.maxWidth = "100%";
    }

    if (options.imageHeight) {
      img.style.height = options.imageHeight;
    } else {
      img.style.maxHeight = "100%";
    }

    img.style.objectFit = "contain";

    button.appendChild(img);
  } else {
    button.textContent = options.text || "Cliquer";
  }

  // Applique la fonction de clic si définie
  if (typeof options.onClick === "function") {
    button.addEventListener("click", options.onClick);
  }

  // Applique la police Jaro si spécifiée
  if (options.fontStyle?.includes("font-jaro")) {
    button.style.fontFamily = '"Jaro", sans-serif';
  }

  // Effet hover
  function addHoverEffect(button: HTMLButtonElement) {
    button.addEventListener("mouseenter", () => {
      button.classList.add("shadow-lg", "brightness-110");
    });
    button.addEventListener("mouseleave", () => {
      button.classList.remove("shadow-lg", "brightness-110");
    });
  }

  addHoverEffect(button);

  return button;
}
