import { useLanguage } from "#hooks/useLanguage.ts";
import _ from "lodash";

export const useValidation = () => {
  return [ValidFormCompletion, ValidFormInputs];
}

const ValidFormCompletion = (
  data: any,
  setError: (toSet: string) => void
) => {
  let result = true;

  Object.entries(data).forEach(([key, value]) => {
    if (_.isEmpty(value) && result) {
      setError(useLanguage("empty_form") + useLanguage(key));
      result = false;
    }
  });

  return result;
};

const ValidFormInputs = (
  props: {
    name?: string;
    email?: string;
    password?: string;
  },
  setError: (toSet: string) => void
) => {
  const { name, email, password } = props;

  let errors = new Array();

  if (email) isValidEmail(email, errors);
  if (name) isValidName(name, errors);
  if (password) isValidPassword(password, errors);

  if (errors.length != 0) {
    const errs = errors.join("\n\n");
    setError(errs);
    return false;
  }
  return true;
};

function isValidEmail(email: string, errors: string[]) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    errors.push(useLanguage("error_email_format"));
  }
}

function isValidPassword(password: string, errors: string[]) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!regex.test(password)) {
    errors?.push(useLanguage("error_pw_complexity"));
  } else if (password.length < 8) {
    errors?.push(useLanguage("error_pw_length"));
  }
}

function isValidName(name: string, errors?: string[]) {
  if (name.length < 3 || name.length > 20) {
    errors?.push(useLanguage("error_name_length"));
  }
}
