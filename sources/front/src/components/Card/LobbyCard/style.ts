export const lobby_card = (isJoinable: boolean) => `
    ${isJoinable ? "block" : "hidden"}
    flex
    w-full
    h-[115px]
    border-black
    border-3
    bg-[#f54900]
    justify-between
    rounded-[10px]
    p-[10px]
    gap-[20px]
`;

export const lobby_card_img = `
    h-full
    rounded-[5px]
    border-black
    border-solid
    border-3
`;

export const lobby_card_action = `
    flex 
    flex-col 
    justify-center 
    flex-initial 
    gap-[5px]
`;

export const join_button = `
    flex
    p-2
    text-1xl 
    border-3
    border-black
    bg-yellow-500
    h-fit
    w-full
    justify-center
    rounded-[10px]
    cursor-pointer
    hover:brightness-150
    cursor-pointer
    duration-300
`;
