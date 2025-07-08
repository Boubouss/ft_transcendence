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

    console.log("✅ Utilisateur créé :", newUser);
  } catch (error: unknown) {
 if (axios.isAxiosError(error)) {
      console.log("Useredit error : " + error);
      console.error("Détail validationErrors :", JSON.stringify(error.response?.data?.validationErrors, null, 2));
      alert("Error: " + error);
    } else if (error instanceof Error) {
      console.error("❌ Erreur editUser :", error.message);
    } else {
      console.error("❌ Erreur editUser :", error);
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
      console.log("Useredit error : " + error);
      console.error("Détail validationErrors :", JSON.stringify(error.response?.data?.validationErrors, null, 2));
      alert("Error: " + error);

    } else if (error instanceof Error) {
      console.error("❌ Erreur editUser :", error.message);
    } else {
      console.error("❌ Erreur editUser :", error);
    }
  }
}

export async function editUser(name: string | null, email: string | null, password: string | null) {
  const id = authStorage.getUserValue("id");
  const configuration = authStorage.getConfiguration();
  const token = authStorage.getUserValue("token"); // Récupération du token

  if (!token || !id) {
    console.error("❌ Token ou ID utilisateur manquant");
    return;
  }
    let newuser;
  if (password)
      newuser = { id, name, email, password, configuration };
  else
      newuser = { id, name, email, configuration };

  try {
    const response = await axios.put(
      `https://localhost:3000/crud/user/${id}`,
      newuser,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    const user = response.data;
    
    authStorage.saveUser(user);
    authStorage.saveToken(token);

    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Useredit error : " + error);
      console.error("Détail validationErrors :", JSON.stringify(error.response?.data?.validationErrors, null, 2));
      alert("Error: " + error);

    } else if (error instanceof Error) {
      console.error("❌ Erreur editUser :", error.message);
    } else {
      console.error("❌ Erreur editUser :", error);
    }
  }
}

