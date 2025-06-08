import * as authStorage from "@utils/authStorage";

import axios from "axios";

export async function addUser(email: string, name: string, password: string) {
  try {
    const response = await axios.post("https://localhost:3000/auth/register", {
      email,
      name,
      password,
    });

    const newUser = response.data;

    alert("Utilisateur créé !");
    authStorage.saveUser(newUser);
    authStorage.deleteUserValue("password");

    console.log("✅ Utilisateur créé :", newUser);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data || error.message);
      console.error(
        "❌ Erreur addUser :",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      alert(error.message);
      console.error("❌ Erreur addUser :", error.message);
    } else {
      alert(String(error));
      console.error("❌ Erreur addUser :", error);
    }
  }
}

export async function loginUser(name: string, password: string) {
  try {
    const response = await axios.post("https://localhost:3000/auth/login", {
      name,
      password,
    });

    const user = response.data;

    alert("Connexion réussie !");
    authStorage.saveUser(user);

    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data || error.message);
      console.error(
        "❌ Erreur loginUser :",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      alert(error.message);
      console.error("❌ Erreur loginUser :", error.message);
    } else {
      alert(String(error));
      console.error("❌ Erreur loginUser :", error);
    }
  }
}
