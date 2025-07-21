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

export const lobby_infos_container = `
    flex
    flex-col
    w-full
    h-full
    gap-[5px]
    overflow-y-auto
`;

export const ready_button = (props: { isReady: boolean }) => `
    flex
    p-2
    mr-2
    group
    border-3
    border-black
    bg-${props.isReady ? "green" : "red"}-500
    text-3xl
    justify-center
    rounded-[10px]
    cursor-pointer
    justify-self-end
    hover:brightness-150
    cursor-pointer
    duration-300
`;

export const leave_button = `
    flex
    p-2
    mr-2
    group
    border-3
    border-black
    bg-red-500
    text-3xl
    justify-center
    rounded-[10px]
    cursor-pointer
    justify-self-end
    hover:brightness-150
    cursor-pointer
    duration-300
`;
