import { createElement } from "#core/render.ts";
import * as styles from "./style";

type TableProps = {
	content: Record<string, string[]>;
};

const Table = (props: TableProps) => {
	return createElement(
		"table",
		{ class: styles.table },
		createElement(
			"thead",
			null,
			createElement(
				"tr",
				{ class: styles.tr },
				...Object.keys(props.content).map((col) => {
					return createElement("th", { class: styles.th }, col);
				})
			)
		),
		createElement(
			"tbody",
			null,
			...Object.values(props.content).map((rows) => {
				return createElement(
					"tr",
					{ class: styles.tr },
					...rows.map((row) => {
						return createElement("td", { class: styles.td }, row);
					})
				);
			})
		)
	);
};

export default Table;
