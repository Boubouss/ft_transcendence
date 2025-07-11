import { type Component } from "#core/framework.ts";
import { createElement } from "#core/render.ts";

type TableProps = {
	content: Record<string, Component[]>;
};

const Table = (props: TableProps) => {
	return createElement("table", null);
};

export default Table;
