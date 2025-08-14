import Form from "#components/Forms/Form.ts";
import Input from "#components/Inputs/Input.ts";
import { useState } from "#core/hooks/useState.ts";
import { createElement } from "#core/render.ts";
import { useForm } from "#hooks/useForm.ts";
import type { GameConfig, GameMode } from "../type";
import {
  confirmButtonStyle,
  formStyle,
  modeToggleActiveStyle,
  modeToggleInactiveStyle,
  modeToggleLabelStyle,
  modeToggleStyle,
  nameInputContainerStyle,
  nameInputStyle,
  scoreButtonStyle,
  scoreContainerStyle,
  scoreLabelStyle,
} from "./style";

//todo: handle both game mode
function handleLocalForm(formId: string, setConfig: (toSet: any) => void) {
  const form_data = useForm(formId);
  if (!form_data) return; //todo: handle this error

  let config: GameConfig = {
    id: `local-${crypto.randomUUID()}`,
    mode: String(form_data.get("mode")),
    score: Number(form_data.get("score")),
  };

  if (form_data.get("mode") === "tournament") {
    const nicknames = form_data.getAll("name").filter((name) => name);
    const set = [...new Set(nicknames)];
    if (nicknames.length !== set.length) return alert("Invalid config");
    if (nicknames.length <= 2) return alert("Invalid config");
    if (Math.log2(nicknames.length) % 1 !== 0) return alert("Invalid config");
    config.players = nicknames as string[];
  }
  setConfig({ ...config });
}

const ScoreInput = (props: {
  min: number;
  max: number;
  score: number;
  setScore: (toSet: number) => void;
}) => {
  return createElement(
    "div",
    { class: scoreContainerStyle },
    createElement("input", {
      class: scoreButtonStyle + ` border-l-[2px] rounded-l-[8px]`,
      type: `button`,
      value: `<<`,
      onClick: () => props.setScore(props.min),
    }),
    createElement("input", {
      class: scoreButtonStyle,
      type: `button`,
      value: `<`,
      onClick: () => props.setScore(Math.max(props.min, props.score - 1)),
    }),
    createElement("div", { class: scoreLabelStyle }, `${props.score}`),
    createElement("input", {
      class: scoreButtonStyle,
      type: `button`,
      value: `>`,
      onClick: () => props.setScore(Math.min(props.max, props.score + 1)),
    }),
    createElement("input", {
      class: scoreButtonStyle + ` border-r-[2px] rounded-r-[8px]`,
      type: `button`,
      value: `>>`,
      onClick: () => props.setScore(props.max),
    })
  );
};

const LocalForm = (props: { config: any; setConfig: (toSet: any) => void }) => {
  const [mode, setMode] = useState<GameMode>("versus");
  const [score, setScore] = useState<number>(5);

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
      createElement("input", {
        type: "hidden",
        name: "mode",
        value: `${mode}`,
      })
    ),

    createElement(
      "div",
      { class: mode !== "tournament" ? " hidden" : `` },
      createElement("div", { class: `text-center` }, "Players"),
      createElement(
        "div",
        {
          class: nameInputContainerStyle,
          name: "nicknames",
        },
        ...Array.from({ length: 8 }, () =>
          Input({
            attr: {
              class: nameInputStyle,
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
      ScoreInput({ min: 1, max: 10, score: score, setScore: setScore }),
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
