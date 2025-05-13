// src/components/organisms/footer/Footer.ts
export class Footer {
  private element: HTMLFooterElement;

  constructor() {
    this.element = document.createElement('footer');
    this.element.className = 'site-footer';

    const copyright = document.createElement('p');
    copyright.textContent = '© 2023 Mon Site. Tous droits réservés.';
    this.element.appendChild(copyright);
  }

  public render(): HTMLFooterElement {
    return this.element;
  }
}
