export const multi_background: string = `
    flex
    w-full
    h-full
    bg-[url('images/main_background.jpg')]
    bg-cover bg-center
    sm:bg-[length:110%_160%]
    bg-[length:150%_180%]
    p-20
    justify-center
    items-center
`;

export const lobby_container = `
    flex
    w-[1200px]
    h-full
    rounded-[20px]
    border-black
    border-solid
    border-[2px]
    bg-[#ff8904]
    py-20
    px-16
`;

export const lobby_list_container = `
    flex
    flex-col
    w-full
    h-full
    gap-[5px]
    overflow-y-auto
    px-[12px]
    my-scrollbar
`;

export const lobby_card = `
    flex
    w-full
    h-[120px]
    border-black
    border-[2px]
    bg-[#f54900]
    justify-between
    p-[10px]
    gap-[20px]
`;

export const lobby_card_img = `
    h-full
    border-black
    border-solid
    border-[2px]
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
`
