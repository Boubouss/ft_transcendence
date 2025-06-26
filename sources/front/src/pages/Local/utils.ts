import axios, { AxiosError } from 'axios';
const api_logic = import.meta.env.VITE_API_LOGIC_URL;


export async function create_game() {
  try {
    const response = await axios.post(
      `${api_logic}/create_game`,
      {
        gameId: "-1",
        playersId: ["0", "1"],
        scoreMax: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Vérifier si la réponse existe et contient un code d'état
      if (error.response) {
        //console.error("Erreur de la requête :", error.response.data);
        console.error("Code d'état :", error.response.status);
        //console.error("En-têtes :", error.response.headers);
        return error.response.status; // Retourner le code d'état HTTP
      } else {
        console.error("Erreur sans réponse :", error.message);
        return error.message; // Retourner le message d'erreur
      }
    } else {
      console.error("Erreur inconnue :", error);
      return "Erreur inconnue";
    }
  }
}


export async function delete_game(gameId: string) {
  try {
    const response = await axios.delete(`${api_logic}/delete_game`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: { gameId: gameId },
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("delete game error : " + error);
      console.error(
        "Détail validationErrors :",
        JSON.stringify(error.response?.data?.validationErrors, null, 2)
      );
    }
  }
}
