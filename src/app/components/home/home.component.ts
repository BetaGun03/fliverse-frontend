import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Content } from '../../interfaces/content';
import { ContentService } from '../../services/content/content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIcon, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  slides: Content[] = []
  currentSlide = 0
  intervalId!: any
  contents: Content[] = []

  constructor(public contentService: ContentService, private router: Router){}

  async ngOnInit(): Promise<void> 
  {
    this.slides = await this.contentService.getRandomContents(3, [], [])
    this.contents = await this.contentService.getRandomContents(10, [], [])

    // Automatic slide change every 5 seconds
    this.intervalId = setInterval(() => this.next(), 5000)
  }

  // Clear the interval when the component is destroyed
  ngOnDestroy(): void 
  {
    clearInterval(this.intervalId)
  }

  // Function to go to the previous slide
  prev(): void 
  {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.slides.length - 1
  }

  // Function to go to the next slide
  next(): void 
  {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length
  }

  // Function to go to a specific slide
  goTo(index: number): void 
  {
    this.currentSlide = index
  }

  // Function to go to a specific content (when the user clicks on a content card)
  goToContent(content: Content): void
  {
    this.router.navigate(['/content', content.id], { state: { content: content } })
  }

}
