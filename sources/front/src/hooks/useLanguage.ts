import { getStorage, setStorage } from "../services/data";
import dictionary from "../assets/langs.json";
import _ from "lodash";

type Dictionary = Record<string, string>;

type Dictionaries = Record<string, Dictionary>;

export function useLanguage(key: string) {
	let lang = "FR";
	const configuration = getStorage(localStorage, "transcendence_conf");
	const dictionaries: Dictionaries = dictionary;

	if (
		!_.isEmpty(configuration) &&
		!_.isEmpty(dictionaries[configuration.lang])
	) {
		lang = configuration.lang;
	}

	if (dictionaries[lang] && dictionaries[lang][key]) {
		return dictionaries[lang][key];
	}

	return key;
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
