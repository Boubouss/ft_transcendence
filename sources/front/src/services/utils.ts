import type { User, UserForm } from "#types/user.ts";

export function mapUserFormToUser(form: UserForm): User {
  return {
    id: Number(form.id),
    name: form.name?.toString() ?? "",
    email: form.email?.toString() ?? "",
    avatar:
      form.avatar instanceof HTMLInputElement
        ? form.avatar.value
        : (form.avatar?.toString() ?? ""),
    password: form.password?.toString() ?? "",
    configuration: form.configuration,
  };
}
