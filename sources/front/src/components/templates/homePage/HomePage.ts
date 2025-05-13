
// src/components/templates/homePage/HomePage.ts
import { Header } from '../../organisms/header/Header';
import { Footer } from '../../organisms/footer/Footer';

export class HomePage {
  private element: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'home-page';

    const header = new Header();
    const footer = new Footer();

    const mainContent = document.createElement('main');
    mainContent.className = 'main-content';

    const heroBanner = document.createElement('section');
    heroBanner.className = 'hero-banner';
    heroBanner.innerHTML = '<h1>Bienvenue sur notre site</h1><p>Découvrez nos produits incroyables</p>';

    const featuredProducts = document.createElement('section');
    featuredProducts.className = 'featured-products';
    featuredProducts.innerHTML = '<h2>Produits en vedette</h2>';

    mainContent.appendChild(heroBanner);
    mainContent.appendChild(featuredProducts);

    this.element.appendChild(header.render());
    this.element.appendChild(mainContent);
    this.element.appendChild(footer.render());
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}
