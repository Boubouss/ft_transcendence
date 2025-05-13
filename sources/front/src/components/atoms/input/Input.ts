// src/components/atoms/input/Input.ts
export class Input {
  private element: HTMLInputElement;

  constructor(type: string, placeholder: string) {
    this.element = document.createElement('input');
    this.element.type = type;
    this.element.placeholder = placeholder;
    this.element.className = 'input-field';
  }

  public render(): HTMLInputElement {
    return this.element;
  }
}
