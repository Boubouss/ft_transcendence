import { createElement } from "#src/core/render.ts";

const Stats = () => 
{
    return createElement(
        "div", 
        {}, 
        createElement("h1", null, "Yo, page de stat !")
    );
};

export default Stats;