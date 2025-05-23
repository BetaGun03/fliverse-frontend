import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import gsap from 'gsap';
import { CSSPlugin } from "gsap/CSSPlugin";

gsap.registerPlugin(CSSPlugin);

@Component({
  selector: 'app-carrousel',
  imports: [MatCardModule, MatIcon, CommonModule],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css'
})
export class CarrouselComponent {
  slides = [1, 2, 3] // Number of slides

  ngAfterViewInit(): void 
  {
    gsap.fromTo(
      '.skeleton-shimmer-carrousel',
      { x: '-100%' },
      {
        x: '100%',
        repeat: -1,
        duration: 1.5,
        ease: 'power1.inOut'
      }
    )
  }

}
