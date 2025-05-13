// src/components/organisms/header/Header.ts
import { SearchForm } from '../../molecules/searchForm/SearchForm';

export class Header {
  private element: HTMLHeaderElement;

  constructor() {
    this.element = document.createElement('header');
    this.element.className = 'site-header';

    const logo = document.createElement('img');
    logo.src = 'logo.png';
    logo.alt = 'Logo';
    logo.className = 'logo';

    const searchForm = new SearchForm();

    this.element.appendChild(logo);
    this.element.appendChild(searchForm.render());
  }

  public render(): HTMLHeaderElement {
    return this.element;
  }
}
