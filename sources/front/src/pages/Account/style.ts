import { input_default } from "#components/Inputs/style.ts";

export const account_background = `
    w-full
    h-screen
    bg-[url('/public/images/main_background.jpg')]
    bg-cover bg-center
    sm:bg-[length:110%_160%]
    bg-[length:150%_180%]
    flex
    justify-center
    items-center
`;

export const account_container = `
    relative
    flex flex-col
    items-center
    bg-orange-400
    border-3 border-black
    rounded-[20px]
`;

export const title_container = `mt-[15px] mb-[15px] flex gap-10 items-center`;

export const title_page_account = `text-[70px]`;

export const form_container = `flex flex-row gap-10`;

export const form_account = `gap-[20px] flex flex-col items-center h-full m-[30px]`;

export const input_account =
  input_default +
  `
    text-[25px]
    cursor-not-allowed
`;

export const avatarxpwd_account = `
    flex flex-row gap-10`;

export const avatar_button_change = `
    mt-[9px]
    text-[30px]
    p-[7px]
    border-3
    rounded-[10px]
    bg-[#FFFFFF99] `;

export const toggle_account = `
    peer
    sr-only
`;

export const button_close = `
    ml-[20px]
    w-[70px]
    h-[70px]
    bg-orange-400
    rounded-[20px]
    p-[10px]
    border-3
    `;

export const image_button_close = ``;

export const avatar_container = `
    rounded-full
    w-[200px]
    h-[200px]
    border-2
    mr-[20px]
`;

export const avatar = `
    rounded-full

`;

export const submit_account_default = `
flex
items-center justify-center
text-[60px]
border-3 rounded-[20px]
pl-[15px]  pr-[15px]
mb-[20px]`;
