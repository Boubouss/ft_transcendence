// AccountModalSystem.ts
import { createAccountModal } from './AccountModal';
import * as authStorage from '../../utils/authStorage';
import { createCustomButton } from '../../components/Buttons/CustomButton';
import { navigateTo } from '../../router';

export function renderAccount() {
  const existing = document.getElementById('account-modal');
  if (existing) existing.remove();

  const modal = createAccountModal();
  document.body.appendChild(modal);

  const modalContainer = modal.querySelector(".relative")!;
  modalContainer.addEventListener("click", (e) => e.stopPropagation());

  const closeButton = createCustomButton({
    width: "60px",
    height: "60px",
    borderRadius: "rounded-[20px]",
    position: "absolute top-5 right-5",
    imageUrl: "/assets/icons/close_icon.png",
    imageWidth: "38px",
    imageHeight: "38px",
    onClick: () => modal.remove(),
  });
  modalContainer.appendChild(closeButton);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const toggle = modal.querySelector<HTMLImageElement>('#toggle-password');
  const passwordInput = modal.querySelector<HTMLInputElement>('#password');
  if (toggle && passwordInput) {
    toggle.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      passwordInput.value = isHidden ? 'coucou' : '******';
      toggle.src = isHidden ? '/assets/icons/close_eye.png' : '/assets/icons/open_eye.png';
    });
  }

  const emailInit = authStorage.getUserValue('email');
  const usernameInit = authStorage.getUserValue('username');
  const buttonContainer = modal.querySelector<HTMLDivElement>('#button-container')!;

  let isEditing = false;
  const modifyButton = createCustomButton({
    width: "250px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: "Modifier les informations",
    onClick: () => toggleEditMode(),
  });

  const validateButton = createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: "Valider",
    onClick: () => {
      valideModif();
    },
  });

  const cancelButton = createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: "Annuler",
    onClick: () => {
      modal.querySelector<HTMLInputElement>('#email')!.value = emailInit;
      modal.querySelector<HTMLInputElement>('#username')!.value = usernameInit;
      toggleEditMode();
    },
  });

  buttonContainer.appendChild(modifyButton);
  const emailInput = modal.querySelector<HTMLInputElement>('#email')!;
  const usernameInput = modal.querySelector<HTMLInputElement>('#username')!;


  function valideModif() {
      toggleEditMode();
      authStorage.setUserValue("email", emailInput);
      authStorage.setUserValue("username", usernameInput);
      alert("Modifications validées !");
  }

  function toggleEditMode() {
    isEditing = !isEditing;
    const passwordInput = modal.querySelector<HTMLInputElement>('#password')!;
    const toggleEye = modal.querySelector<HTMLImageElement>('#toggle-password')!;

    emailInput.readOnly = !isEditing;
    usernameInput.readOnly = !isEditing;
    toggleEye.style.display = isEditing ? 'none' : 'block';

    passwordInput.type = 'password';
    passwordInput.value = '*******';

    buttonContainer.innerHTML = '';
    if (isEditing) {
      buttonContainer.appendChild(validateButton);
      buttonContainer.appendChild(cancelButton);
    } else {
      buttonContainer.appendChild(modifyButton);
    }
  }

  navigateTo("home");
}
