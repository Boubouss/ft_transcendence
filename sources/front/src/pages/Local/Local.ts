import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";

const Local = () => {
 
  return createElement("div", { class: home_background }, NavigationBar({}));
};

export default Local;
