import { getStorage, setStorage } from "../services/data";
import dictionary from "../assets/langs.json";
import _ from "lodash";
import { KeysStorage } from "#types/enums.ts";

type Dictionary = Record<string, string>;

type Dictionaries = Record<string, Dictionary>;

export function useLanguage(key: string, count?: number) {
  let lang = "FR";
  const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);
  const dictionaries: Dictionaries = dictionary;

  if (
    !_.isEmpty(configuration) &&
    !_.isEmpty(dictionaries[configuration.lang])
  ) {
    lang = configuration.lang;
  }

  if (
    count &&
    count > 1 &&
    dictionaries[lang] &&
    dictionaries[lang][`plural_${key}`]
  ) {
    return dictionaries[lang][`plural_${key}`];
  } else if (dictionaries[lang] && dictionaries[lang][key]) {
    return dictionaries[lang][key];
  }

  return key;
}

export const handleLang = (
  language: string,
  setLanguage: (toSet: string) => void
) => {
  const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);
  const { lang, ...confData } = configuration;
  setStorage(localStorage, KeysStorage.CONFTRANS, {
    lang: language,
    ...confData,
  });
  setLanguage(language);
};
