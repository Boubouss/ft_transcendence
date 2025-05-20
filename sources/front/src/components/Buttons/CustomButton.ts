interface CustomButtonOptions {
  backgroundColor?: string; // ex: "bg-orange-500"
  width?: string; // ex: "200px"
  height?: string; // ex: "150px"
  textColor?: string; // ex: "text-black"
  borderColor?: string; // ex: "border-black"
  borderWidth?: string; // ex: "border-2"
  borderRadius?: string; // ex: "rounded-[20px]"
  redirectUrl?: string; // ex: "/next-page"
  position?: string; // ex: "absolute bottom-10 left-1/2 transform -translate-x-1/2"
  text?: string; // texte à afficher (si pas d'image)
  imageUrl?: string; // url de l'image à afficher dans le bouton
  fontStyle?: string; // ex: "font-serif italic font-bold"
  fontSizeClass?: string;
}

export function createCustomButton(
  options: CustomButtonOptions
): HTMLButtonElement {
  const button = document.createElement("button");

  // Construire les classes CSS (utilise Tailwind ou classes custom)
  const classes = [
    options.position || "",
    options.backgroundColor || "bg-orange-500",
    options.textColor || "text-black",
    options.borderWidth || "border-2",
    options.borderColor || "border-black",
    options.borderRadius || "rounded-[20px]",
    options.fontStyle || "", // ajout de la classe fontStyle
    options.fontSizeClass || "text-lg",
    "font-bold",
    "flex",
    "items-center",
    "justify-center",
  ]
    .filter(Boolean)
    .join(" ");

  button.className = classes;

  // Taille par style inline (taille fixe)
  if (options.width) button.style.width = options.width;
  if (options.height) button.style.height = options.height;

  // Contenu : image ou texte
  if (options.imageUrl) {
    const img = document.createElement("img");
    img.src = options.imageUrl;
    img.alt = options.text || "button image";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    button.appendChild(img);
  } else {
    button.textContent = options.text || "Cliquer";
  }

  // Clic : redirection si défini
  if (options.redirectUrl) {
    button.addEventListener("click", () => {
      window.location.href = options.redirectUrl!;
    });
  }

  if (options.fontStyle?.includes("font-jaro")) {
    button.style.fontFamily = '"Jaro", sans-serif';
  }

  return button;
}
