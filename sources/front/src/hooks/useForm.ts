export function useForm(id: string) {
  return document.getElementById(id)
    ? new FormData(document.getElementById(id) as HTMLFormElement)
    : null;
}
