import { getStorage, setStorage } from "./data";
import dictionary from "../assets/langs.json";

type Dictionary = Record<string, string>;

type Dictionaries = Record<string, Dictionary>;

export function useLanguage(key: string) {
	const configuration = getStorage(localStorage, "transcendence_conf");
	const dictionaries: Dictionaries = dictionary;

	if (
		configuration &&
		configuration["lang"] &&
		dictionaries[configuration["lang"]] &&
		dictionaries[configuration["lang"]][key]
	) {
		return dictionaries[configuration.lang][key];
	}
	return "";
}

export const handleLang = (
	language: string,
	setLanguage: (toSet: string) => void
) => {
	const configuration = getStorage(localStorage, "transcendence_conf");
	const { lang, ...confData } = configuration;
	setStorage(localStorage, "transcendence_conf", {
		lang: language,
		...confData,
	});
	setLanguage(language);
};
