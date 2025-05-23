import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import gsap from 'gsap';
import { CSSPlugin } from "gsap/CSSPlugin";

gsap.registerPlugin(CSSPlugin);

@Component({
  selector: 'app-card',
  imports: [MatCardModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  ngAfterViewInit(): void 
  {
    gsap.fromTo(
      '.skeleton-shimmer',
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
