// src/main.ts

import './assets/styles/style.css'; // importe les styles
import { renderHome } from './pages/Home/Home.ts'; // importe la fonction depuis home.ts
import { renderSign } from './pages/Sign/Sign.ts';
import * as authStorage from './utils/authStorage';

//renderHome(); // exécute la fonction qui affiche la page d'accueil
authStorage.clearAuth()
renderSign();
