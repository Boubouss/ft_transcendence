
// src/components/atoms/button/Button.ts
export class Button {
  private element: HTMLButtonElement;

  constructor(label: string, onClick: () => void) {
    this.element = document.createElement('button');
    this.element.className = 'btn';
    this.element.textContent = label;
    this.element.addEventListener('click', onClick);
  }

  public render(): HTMLButtonElement {
    return this.element;
  }
}
