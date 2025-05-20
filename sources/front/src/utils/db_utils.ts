import * as authStorage from "@utils/authStorage";

export async function addUser(
  email: string,
  username: string,
  password: string
) {
  try {
    const token = "fake-jwt-token-" + Date.now();
    const a2f = false;

    const userToCreate = {
      email,
      username,
      password,
      token,
      a2f,
    };

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToCreate),
    });

    if (!response.ok)
      throw new Error("Erreur lors de l'ajout de l'utilisateur");

    const newUser = await response.json();

    // Sauvegarde dans le localStorage si besoin
    authStorage.saveUser(newUser);
    //authStorage.saveToken(newUser.token);
    authStorage.deleteUserValue("password");

    console.log("✅ Utilisateur créé :", newUser);
  } catch (error) {
    console.error("❌ Erreur addUser :", error);
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


