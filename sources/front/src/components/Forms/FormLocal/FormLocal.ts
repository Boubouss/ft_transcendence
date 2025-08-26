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
import { useLanguage } from "#hooks/useLanguage.ts";
import type { ComponentAttr } from "#core/framework.ts";

function handleLocalForm(formId: string, setConfig: (toSet: any) => void) {
  const form_data = useForm(formId);
  if (!form_data) return;

  let config: LocalConfig = {
    mode: String(form_data.get("mode")),
    score: Number(form_data.get("score")),
    players: ["P1", "P2"],
  };

  if (form_data.get("mode") === "tournament") {
    const size = Number(form_data.get("size"));
    const nicknames = (form_data.getAll("name").slice(0, size) as string[]).map(
      (p) => p.trim()
    );
    const set = [...new Set(nicknames)];

    const validName = (name: string) => {
      return /^[a-zA-Z0-9]{1,20}$/.test(name.trim());
    };

    if (nicknames.some((p) => !p)) return alert("Missing nicknames");
    if (nicknames.length !== set.length) return alert("No duplicate allowed");
    if (Math.log2(nicknames.length) % 1 !== 0) return alert("Invalid config");
    if (!nicknames.every(validName))
      return alert(
        "Invalid nickname format\nBetween 1 to 20 alphanumeric characters"
      );

    config.players = nicknames;
  }
  setConfig({ ...config });
}

const LocalForm = (props: {
  config: any;
  setConfig: (toSet: any) => void;
  attr?: ComponentAttr;
}) => {
  const scoreOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sizeOptions: number[] = [4, 8, 16];

  const [mode, setMode] = useState<LocalMode>("versus");
  const [score, setScore] = useState<number>(5);
  const [size, setSize] = useState<number>(8);

  const default_attr = { class: `${formStyle}`, id: "local_form" };
  let { attr } = props;
  attr = { ...default_attr, ...(attr || {}) };
  return Form(
    { attr: attr },
    createElement(
      "div",
      { class: modeToggleStyle },
      createElement("input", {
        type: "button",
        value: useLanguage("versus"),
        class: `${modeToggleLabelStyle} ${
          mode === "versus" ? modeToggleActiveStyle : modeToggleInactiveStyle
        }`,
        onClick: () => {
          if (mode !== "versus") setMode("versus");
        },
      }),
      createElement("input", {
        type: "button",
        value: useLanguage("tournament"),
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
      createElement(
        "div",
        { class: `text-center` },
        useLanguage("tournament_size")
      ),
      Selector({ values: sizeOptions, value: size, setValue: setSize }),
      createElement("input", { type: "hidden", name: "size", value: `${size}` })
    ),
    createElement(
      "div",
      { class: mode !== "tournament" ? " hidden" : `` },
      createElement("div", { class: `text-center` }, useLanguage("players")),
      createElement(
        "div",
        {
          class: `${nameInputContainerStyle} grid-cols-${size / 4}`,
          name: "nicknames",
        },
        ...Array.from({ length: _.last(sizeOptions) as number }, (_, i) =>
          Input({
            attr: {
              class: `${nameInputStyle}${i >= size ? " hidden" : ""}`,
              name: `name`,
              placeholder: useLanguage(`nickname`),
              type: "text",
              value: crypto.randomUUID().split("-")[0],
            },
          })
        )
      )
    ),

    createElement(
      "div",
      {},
      createElement("p", { class: `text-center` }, useLanguage("score_round")),
      Selector({
        values: scoreOptions,
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
      value: useLanguage("start"),
      class: confirmButtonStyle,
      onClick: () => handleLocalForm("local_form", props.setConfig),
    })
  );
};

export default LocalForm;
