// src/components/pages/home/Home.ts
import { HomePage } from '../../templates/homePage/HomePage';

export class Home {
  private element: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'home';

    const homePage = new HomePage();
    this.element.appendChild(homePage.render());
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}
