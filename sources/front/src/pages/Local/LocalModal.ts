import { CloseBtnOptions, createCloseButton } from "@/components/Buttons/AccountButtons";
import { createCustomButton } from "@/components/Buttons/CustomButton";
import { navigateTo } from "@/router";
import { changeRoute } from "@/utils/events";
import { t } from "@/utils/i18n";

export function renderModalLocal() {
  const existing = document.getElementById("local-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "local-modal";
  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const content_local = create_content_local(modal);

  modal.appendChild(content_local);
  document.body.appendChild(modal);
  navigateTo("home");
}

function create_content_local(modal :HTMLElement): HTMLElement {
  const content_local = document.createElement("div");
  content_local.className = `
  	relative
    flex
    flex-row
    items-center
	justify-center
    p-6
    gap-5
    bg-orange-400
    border-2
    border-black
    m-5
    overflow-y-auto
    max-w-[400px]
    w-full
    max-h-[90%]
	h-[160px]
	rounded-[20px]
	`;

  	content_local.style.fontFamily = "'Jaro', sans-serif";


	const CloseButton = createCustomButton({
		...CloseBtnOptions,
		position: "top-5 right-5",
		onClick: () => {
			modal.remove();
		}
	})

	CloseButton

	const base_button = {
		backgroundColor: "bg-orange-200",
		textColor: "text-black",
		padding: "p-6",
		fontSizeClass: "sm:text-2xl text-1xl",
	}

	const local_button = createCustomButton({
		...base_button,
		text: t("vs"),
		onClick: () => {
			modal.remove();
			changeRoute("1v1")
		}
	})


	const tournament_button = createCustomButton({
		...base_button,
		text: t("tournament"),
	})

	local_button.classList.add("flex-1");
	tournament_button.classList.add("flex-1");

	content_local.appendChild(CloseButton);
	content_local.appendChild(local_button);
	content_local.appendChild(tournament_button);

  return content_local;
}
