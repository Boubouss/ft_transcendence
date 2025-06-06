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
      console.error("❌ Erreur addUser :", error.response?.data || error.message);
    } else if (error instanceof Error) {
      alert(error.message);
      console.error("❌ Erreur addUser :", error.message);
    } else {
      alert(String(error));
      console.error("❌ Erreur addUser :", error);
    }
  }
}


export async function loginUser(username: string, password: string) {
  try {
    const response = await fetch(`http://localhost:3000/users?username=${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error("Erreur serveur");

    const users = await response.json();
    if (users.length === 0) throw new Error("Utilisateur non trouvé");

    const user = users[0];

    if (user.password !== password) {
      throw new Error("Mot de passe incorrect");
    }

    authStorage.saveUser(user);
    authStorage.deleteUserValue("password");

    console.log("✅ Connexion réussie :", user);
    return user;
  } catch (error) {
    console.error("❌ Erreur loginUser :", error);
    throw error;
  }
}


