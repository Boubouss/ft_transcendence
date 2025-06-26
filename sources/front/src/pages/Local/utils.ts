import axios from "axios";
const api_logic = import.meta.env.VITE_API_LOGIC_URL;

export async function create_game() {
  try {
    const response = await axios.post(
	`${api_logic}/create_game`, {
		"gameId": "-1",
		"playersId": ["0", "1"],
		"scoreMax": 100,
    },
	{
		headers: {
			"Content-Type": "application/json",
		},
	}
);

    const data = response.data;
	console.log(data);

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("create game error : " + error);
      console.error(
        "Détail validationErrors :",
        JSON.stringify(error.response?.data?.validationErrors, null, 2)
      );
	}
  }
}
