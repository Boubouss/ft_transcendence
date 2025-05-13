// src/main.ts
import { Home } from './components/pages/home/Home';
import { ProductCard } from './components/molecules/productCard/ProductCard';
import './assets/styles/tailwind.css';



document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    const home = new Home();
    app.appendChild(home.render());

    // Ajout de quelques ProductCards à la section featured-products
    const featuredProductsSection = document.querySelector('.featured-products');
    if (featuredProductsSection) {
      const product1 = new ProductCard('product1.webp', 'Produit 1', '19,99 €');
      const product2 = new ProductCard('product2.webp', 'Produit 2', '29,99 €');

      featuredProductsSection.appendChild(product1.render());
      featuredProductsSection.appendChild(product2.render());
    }
  }
});
