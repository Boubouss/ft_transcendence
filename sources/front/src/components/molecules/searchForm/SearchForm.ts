// src/components/molecules/searchForm/SearchForm.ts
import { Button } from '../../atoms/button/Button';
import { Input } from '../../atoms/input/Input';

export class SearchForm {
  private element: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'search-form';

    const input = new Input('text', 'Rechercher...');
    const button = new Button('Rechercher', () => {
      console.log('Recherche effectuée');
    });

    this.element.appendChild(input.render());
    this.element.appendChild(button.render());
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}
