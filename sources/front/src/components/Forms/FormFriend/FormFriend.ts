import Form from "../Form";
import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit.ts";
import { form_friend } from "../style";
import type { Friendship } from "#types/user.ts";
import { handleSendFriendRequest } from "#sockets/Friends/request.ts";
import { useForm } from "#hooks/useForm.ts";
import { useLanguage } from "#hooks/useLanguage.ts";

const FormFriend = (props: {
	getter: Friendship | null;
	setter: (toSet: Friendship | null) => void;
	socket?: WebSocket | null;
}) => {
	return Form(
		{
			attr: {
				class: form_friend,
				id: "form_friend",
			},
		},
		Input({
			attr: {
				type: "text",
				name: "name",
				placeholder: useLanguage("username"),
			},
		}),
		Submit({
			text: useLanguage("send"),
			attr: {
				onClick: () => handleSendFriendRequest(props, useForm("form_friend")),
			},
		})
	);
};

export default FormFriend;
