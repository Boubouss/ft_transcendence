export const player_card = `
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

export const player_card_img = `
    h-full
    rounded-[5px]
    border-black
    border-solid
    border-3
    w-[87px]
    object-cover
`;

export const player_card_action = `
    flex 
    flex-col 
    justify-center 
    flex-initial 
    gap-[5px]
`;

export const score_container = (props: { isWinner?: boolean }) => `
   text-2xl 
   border-solid
   border-3
   border-black
   rounded-[10px]
   px-[18px]
   py-[9px]
   m-1
   bg-${props.isWinner ? "green-500" : "red-500"}
`;

export const kick_button = `
    flex
    p-2
    text-1xl 
    border-3
    border-black
    bg-yellow-400
    justify-center
    rounded-[10px]
    cursor-pointer
    hover:brightness-150
    cursor-pointer
    duration-300
`;
