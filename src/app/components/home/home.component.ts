import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Product {
  name: string;
  description: string;
  date: Date;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIcon, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  slides: string[] = [];
  currentSlide = 0;
  intervalId!: any;

  products: Product[] = [];

  ngOnInit(): void {
    // Datos de ejemplo
    this.slides = [
      'https://fliversestorageaccount.blob.core.windows.net/fliversecontainer/MV5BOGZlN2EzOTYtMzUzOS00NTM3LTg0MTQtZDVjZGM4YmJlNWNhXkEyXkFqcGc@._V1_.jpg',
      'https://fliversestorageaccount.blob.core.windows.net/fliversecontainer/MV5BOGZlN2EzOTYtMzUzOS00NTM3LTg0MTQtZDVjZGM4YmJlNWNhXkEyXkFqcGc@._V1_.jpg',
      'https://fliversestorageaccount.blob.core.windows.net/fliversecontainer/MV5BOGZlN2EzOTYtMzUzOS00NTM3LTg0MTQtZDVjZGM4YmJlNWNhXkEyXkFqcGc@._V1_.jpg',
      'https://fliversestorageaccount.blob.core.windows.net/fliversecontainer/Mi contenido 3-1745762556534-logo_fliverse_favicon.png',
      'https://fliversestorageaccount.blob.core.windows.net/fliversecontainer/Mi contenido 3-1745762556534-logo_fliverse_favicon.png',
      'https://fliversestorageaccount.blob.core.windows.net/fliversecontainer/Mi contenido 3-1745762556534-logo_fliverse_favicon.png',
    ];

    this.products = Array.from({ length: 10 }).map((_, i) => ({
      name: `Contenido ${i + 1}`,
      description: `Descripción breve del contenido ${i + 1}`,
      date: new Date(2025, 0, i + 1),
      image: `https://fliversestorageaccount.blob.core.windows.net/fliversecontainer/MV5BOGZlN2EzOTYtMzUzOS00NTM3LTg0MTQtZDVjZGM4YmJlNWNhXkEyXkFqcGc@._V1_.jpg`
    }));

    // Auto-rotación de slides cada 5s
    this.intervalId = setInterval(() => this.next(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  prev(): void {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.slides.length - 1;
  }

  next(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goTo(index: number): void {
    this.currentSlide = index;
  }
}
