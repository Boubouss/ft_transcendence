import Form from "#components/Forms/Form";
import Input from "#components/Inputs/Input";
import Selector from "#components/Inputs/Selector/Selector";
import _ from "lodash";
import type { LocalConfig, LocalMode } from "#types/local";
import {
  confirmButtonStyle,
  formStyle,
  modeToggleActiveStyle,
  modeToggleInactiveStyle,
  modeToggleLabelStyle,
  modeToggleStyle,
  nameInputContainerStyle,
  nameInputStyle,
} from "./style";
import { createElement } from "#core/render.ts";
import { useForm } from "#hooks/useForm.ts";
import { useState } from "#core/hooks/useState.ts";

//todo: handle both game mode
function handleLocalForm(formId: string, setConfig: (toSet: any) => void) {
  const form_data = useForm(formId);
  if (!form_data) return; //todo: handle this error

  let config: LocalConfig = {
    mode: String(form_data.get("mode")),
    score: Number(form_data.get("score")),
    players: ["0", "1"],
  };

  if (form_data.get("mode") === "tournament") {
    const size = Number(form_data.get("size"));
    const nicknames = form_data.getAll("name").slice(0, size);
    const set = [...new Set(nicknames)];

    if (nicknames.length !== set.length) return alert("Invalid config");
    if (nicknames.length <= 2) return alert("Invalid config");
    if (Math.log2(nicknames.length) % 1 !== 0) return alert("Invalid config");
    config.players = nicknames as string[];
  }
  setConfig({ ...config });
}

const LocalForm = (props: { config: any; setConfig: (toSet: any) => void }) => {
  const scoreOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sizeOptions: number[] = [4, 8, 16];

  const [mode, setMode] = useState<LocalMode>("tournament");
  const [score, setScore] = useState<number>(5);
  const [size, setSize] = useState<number>(4);

  return Form(
    { attr: { class: formStyle, id: "local_form" } },

    createElement(
      "div",
      { class: modeToggleStyle },
      createElement("input", {
        type: "button",
        value: "Versus",
        class: `${modeToggleLabelStyle} ${
          mode === "versus" ? modeToggleActiveStyle : modeToggleInactiveStyle
        }`,
        onClick: () => {
          if (mode !== "versus") setMode("versus");
        },
      }),
      createElement("input", {
        type: "button",
        value: "Tournament",
        class: `${modeToggleLabelStyle} ${
          mode === "tournament"
            ? modeToggleActiveStyle
            : modeToggleInactiveStyle
        }`,
        onClick: () => {
          if (mode !== "tournament") setMode("tournament");
        },
      }),
      createElement("input", { type: "hidden", name: "mode", value: `${mode}` })
    ),

    createElement(
      "div",
      { class: mode !== "tournament" ? " hidden" : `` },
      createElement("div", { class: `text-center` }, "Tournament Size"),
      Selector({ values: sizeOptions, value: size, setValue: setSize }),
      createElement("input", { type: "hidden", name: "size", value: `${size}` })
    ),
    createElement(
      "div",
      { class: mode !== "tournament" ? " hidden" : `` },
      createElement("div", { class: `text-center` }, "Players"),
      createElement(
        "div",
        {
          class: `${nameInputContainerStyle} grid-cols-${size / 4}`,
          // class: `${nameInputContainerStyle} grid-cols-4`,
          name: "nicknames",
        },
        ...Array.from({ length: _.last(sizeOptions) as number }, (_, i) =>
          Input({
            attr: {
              class: `${nameInputStyle}${i >= size ? " hidden" : ""}`,
              name: `name`,
              placeholder: `Nickname`,
              type: "text",
              value: crypto.randomUUID().split("-")[0], //todo: removed after the tests
            },
          })
        )
      )
    ),

    createElement(
      "div",
      {},
      createElement("p", { class: `text-center` }, "Score/Round"),
      Selector({
        values: scoreOptions, //todo: remove the hardcoded value
        value: score,
        setValue: setScore,
      }),
      createElement("input", {
        type: "hidden",
        name: "score",
        value: `${score}`,
      })
    ),

    createElement("input", {
      type: "button",
      value: "Start",
      class: confirmButtonStyle,
      onClick: () => handleLocalForm("local_form", props.setConfig),
    })
  );
};

export default LocalForm;
