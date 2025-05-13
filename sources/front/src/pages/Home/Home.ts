// src/home.ts
import { renderNavBar } from '../../components/Nav_bar/Nav_bar.ts';
import { createCustomButton } from "../../components/Buttons/CustomButton.ts";



export function renderHome() {
  const app = document.createElement('div');
  app.innerHTML = `
    <div class="bg-[url('/assets/images/main-menu_background.jpg')] h-screen w-screen bg-cover bg-center"></div>
  `;

  renderNavBar();
  document.body.appendChild(app);
}
