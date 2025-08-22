export const input_default = `
	sr-only peer
`;

export const toggle_default = `
	cursor-pointer
	relative
	flex
	justify-around
	items-center
	w-[80px]
	h-[40px]
	bg-red-500
	outline-none
	rounded-full
	border-3
	peer
	peer-checked:after:translate-x-[40px]
	rtl:peer-checked:after:-translate-x-[40px]
	peer-checked:after:border-white after:absolute
	after:top-[2px]
	after:start-[2px]
	after:bg-white after:border-red-400
	after:border
	after:rounded-full
	after:h-[30px]
	after:w-[30px]
	after:transition-[40px]
	peer-checked:bg-green-500
`;

export const span_on = `
	text-md
	font-medium
	text-gray-900
`;

export const span_off = `
	text-md
	font-medium
	text-gray-900
`;
