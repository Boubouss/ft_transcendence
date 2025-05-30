// AccountModal.ts (modifié)
import * as authStorage from '../../utils/authStorage';

export function createAccountModal(): HTMLDivElement {
  const username = authStorage.getUserValue('username');
  const email = authStorage.getUserValue('email');
  const avatarUrl = authStorage.getUserValue('avatar') || '/assets/icons/default_avatar.png';

  const modal = document.createElement("div");
  modal.id = "account-modal";
  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000"
  });

  modal.innerHTML = `
    <div style="font-family: 'Jaro', sans-serif" class="relative bg-orange-500 text-black rounded-2xl p-6 h-[800px] w-[700px] border-2 border-black shadow-2xl">
      <h2 style="font-family: 'Jaro', sans-serif" class="text-7xl absolute top-3 left-6">Paramètres</h2>
      <div class="absolute left-0 right-0 top-[100px] h-[3px] bg-black"></div>
      <div class="absolute top-[140px] left-[235px] transform -translate-x-1/2 w-[430px] h-[80px] bg-[#FFFFFF99] rounded-[20px] border-2 border-black flex items-center justify-center">
        <p style="font-family: 'Jaro', sans-serif" class="text-black text-4xl m-0">Informations du compte</p>
      </div>
      <div class="bg-[url('../../assets/images/main-menu_background.jpg')] absolute top-[120px] left-[500px] w-[160px] h-[160px] rounded-full border-2 border-black overflow-hidden">
        <img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover" style="transform: scale(1.2);" />


      </div>
      <div style="font-family: 'Jaro', sans-serif" class="absolute top-[340px] left-[235px] transform -translate-x-1/2 w-[430px] space-y-6">
        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-6 py-3 flex items-center justify-between">
          <label for="email" class="text-black text-2xl font-jaro select-none">Email :</label>
          <input id="email" type="text" readonly value="${email}" class="bg-transparent text-black text-2xl font-jaro w-[250px] focus:outline-none" />
        </div>
        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-6 py-3 flex items-center justify-between">
          <label for="username" class="text-black text-2xl font-jaro select-none">Pseudo :</label>
          <input id="username" type="text" readonly value="${username}" class="bg-transparent text-black text-2xl font-jaro w-[250px] focus:outline-none" />
        </div>
        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-6 py-3 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <label for="password" class="text-black text-2xl font-jaro select-none">Ancien mot de passe :</label>
            <input id="password" type="password" readonly value="******" class="bg-transparent text-black text-2xl font-jaro w-[200px] focus:outline-none" />
          </div>
          <div class="flex items-center justify-between" style="display:none;" id="new-password-container">
            <label for="new-password" class="text-black text-2xl font-jaro select-none">Nouveau MDP :</label>
            <input id="new-password" type="password" value="" class="bg-transparent text-black text-2xl font-jaro w-[200px] focus:outline-none" />
          </div>
        </div>
      </div>
      <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div id="button-container"></div>
      </div>
    </div>
  `;

  return modal;
}
