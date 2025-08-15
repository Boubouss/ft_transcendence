export const lobby_container = `
    flex
    flex-col
    w-full
    h-full
    rounded-[20px]
    border-black
    border-solid
    border-3
    bg-[#ff8904]
    pt-10
    pb-10
    pr-8
    pl-10
    gap-10
`;

export const lobby_list_container = `
    flex
    flex-col
    w-full
    h-full
    gap-[5px]
    overflow-y-auto
    pr-2
    my-scrollbar
`;

export const lobby_card = `
    flex
    w-full
    h-[113px]
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
    bg-green-500
    h-fit
    w-full
    justify-center
    rounded-[10px]
    cursor-pointer
    hover:brightness-150
    duration-300
`;

export const create_lobby_button = `
    flex
    p-2
    mr-2
    group
    border-3
    border-black
    bg-blue-500
    text-3xl
    justify-center
    rounded-[10px]
    cursor-pointer
    justify-self-end
    hover:brightness-150
    cursor-pointer
    duration-300
`;
