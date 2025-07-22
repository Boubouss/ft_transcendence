import _ from "lodash";

export enum API_USER_ROUTES {
	REGISTER = "/auth/register",
	LOGIN = "/auth/login",
	AUTH_2FA = "/auth/2FA",
	GOOGLE = "/auth/google",
	CRUD_USER = "/crud/user",
}

export async function fetchAPI(path: string, options: RequestInit) {
	return await fetch(path, options)
		.then((response) => {
			console.log(response);
			if (!response.ok)
				throw new Error(
					`HTTP Error: ${response.status} ${response.statusText}`
				);
			return response.json();
		})
		.then((data) => {
			console.log(data);
			return data;
		})
		.catch((error) => console.log(error));
}

export function getStorage(storage: Storage, key: string) {
	const data = storage.getItem(key);
	return data ? JSON.parse(data) : null;
}

export function setStorage(storage: Storage, key: string, data: {}) {
	if (_.isEmpty(data)) return;

	const storedData = getStorage(storage, key);
	storage.setItem(key, JSON.stringify({ ...storedData, ...data }));
}

export function replaceStorage(storage: Storage, key: string, data: {}) {
	if (!_.isEmpty(data)) storage.setItem(key, JSON.stringify(data));
}

export function removeStorage(storage: Storage, key: string) {
	if (storage.getItem(key)) storage.removeItem(key);
}
