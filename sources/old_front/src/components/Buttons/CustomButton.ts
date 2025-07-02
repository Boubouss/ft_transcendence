export interface CustomButtonOptions {
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
  imageWidth?: string; // ← Nouvelle option
  minWidth?: string;
  imageHeight?: string; // ← Nouvelle option
  fontStyle?: string;
  padding?: string;
  fontSizeClass?: string;
  visible?: boolean;
  onClick?: (() => void) | ((event: MouseEvent) => void);
  onHover?: (() => void) | ((buttonElement: HTMLButtonElement) => void);

  onLeave?: () => void;
}

export function createCustomButton(
  options: CustomButtonOptions
): HTMLButtonElement {
  const button = document.createElement("button");

  const classes = [
    "group",
    options.position || "",
    options.backgroundColor || "bg-orange-400",
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

    img.style.objectFit = "contain";
    img.style.width = options.imageWidth || "100%";
    img.style.height = options.imageHeight || "100%";

    button.appendChild(img);
  } else {
    button.textContent = options.text || "";
  }

    if (typeof options.onClick === "function") {
    button.addEventListener("click", (event) => {
      if (options.onClick!.length === 0) {
        (options.onClick as () => void)();
      } else {
        (options.onClick as (event: MouseEvent) => void)(event);
      }
    });
  }

  if (options.visible === false) {
    button.style.display = "none";
  } else {
    button.style.display = ""; // visible par défaut (inline-block ou flex selon le contexte)
  }

  if (options.fontStyle?.includes("font-jaro")) {
    button.style.fontFamily = '"Jaro", sans-serif';
  }

  // Gestion du hover
  if (typeof options.onHover === "function") {
    button.addEventListener("mouseenter", () => {
      if (options.onHover!.length === 0) {
        (options.onHover as () => void)();
      } else {
        (options.onHover as (buttonElement: HTMLButtonElement) => void)(button);
      }
    });
  }

  if (typeof options.onLeave === "function") {
    button.addEventListener("mouseleave", options.onLeave);
  }

  // Applique un effet par défaut uniquement si aucun custom
  if (!options.onHover && !options.onLeave) {
    button.addEventListener("mouseenter", () => {
      button.classList.add("shadow-lg", "brightness-110");
    });
    button.addEventListener("mouseleave", () => {
      button.classList.remove("shadow-lg", "brightness-110");
    });
  }

  return button;
}
