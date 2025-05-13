// src/components/molecules/productCard/ProductCard.ts
export class ProductCard {
  private element: HTMLDivElement;

  constructor(imageSrc: string, title: string, price: string) {
    this.element = document.createElement('div');
    this.element.className = 'product-card';

    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = title;
    image.className = 'product-image';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.className = 'product-title';

    const priceElement = document.createElement('p');
    priceElement.textContent = price;
    priceElement.className = 'product-price';

    this.element.appendChild(image);
    this.element.appendChild(titleElement);
    this.element.appendChild(priceElement);
  }

  public render(): HTMLDivElement {
    return this.element;
  }
}
