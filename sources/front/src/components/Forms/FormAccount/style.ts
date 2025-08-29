export const form_account = `flex flex-col items-center `;

export const form_part_inputs = `gap-[20px] flex flex-col items-cenmb-[20px]ter h-full m-[30px]`;

export const input_account = `
    relative
    flex
    bg-[#FFFFFF99]
    rounded-[20px]
    p-3
    border-3
    text-[25px]
    read-only:cursor-not-allowed
    cursor-pointer
    outline-none focus:outline-none
`;

export const eyes_container = `absolute cursor-pointer right-[10px]  w-[25px] h-[25px]`;

export const form_part_avatar = `
    relative
    h-full
    justify-center
    mr-[10px]
`;

export const avatar_container_class = `
    relative
    self-start
`;

export const avatar_img_class = `
    absolute
    top-0
    left-0
    w-[200px]
    mt-[20px]
    h-[200px]
    object-cover
    rounded-full
`;

export const avatar_class = `
    z-1
    rounded-full
    w-[200px]
    h-[200px]
    border-2
    mr-[20px]
    text-[0px]
    mt-[20px]
    self-start
    items-center
    cursor-pointer
    disabled:cursor-not-allowed
    disabled:brightness-90
    bg-center
    bg-cover
`;

export const eyes_img = ``;

export const toggle_account = `
    peer
    sr-only
`;

export const a2f_container = `flex flex-col items-center`;

export const a2f_title = `text-[25px]`;

export const edit_btn = (isEditing: boolean) => {
  return (
    `border-2 p-3 rounded-[20px] cursor-pointer` +
    (isEditing ? ` bg-green-400` : ``)
  );
};

export const edit_container = `flex flex-col items-center m-[10px] gap-[10px]`;

export const edit_message = `text-[20px]`;

export const submit_account_default = (isEditing: boolean) => {
  return (
    `
flex
items-center justify-center
text-[60px]
bg-orange-500
border-3 rounded-[20px]
pl-[15px]  pr-[15px]
mb-[20px]
cursor-pointer` + (!isEditing ? " brightness-50 cursor-not-allowed" : "")
  );
};
