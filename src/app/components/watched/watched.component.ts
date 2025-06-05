import { Component } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { Content } from '../../interfaces/content';

@Component({
  selector: 'app-watched',
  imports: [MatIconModule, CommonModule],
  templateUrl: './watched.component.html',
  styleUrl: './watched.component.css'
})
export class WatchedComponent {

  isLoading: boolean = false

  constructor(public contentService: ContentService, public router: Router, private location: Location) 
  {
    if(this.contentService.getWatchedContents().length > 0)
    {
      console.log('Watched contents already loaded')
      this.getWatchedContent()
    }
  }

  async getWatchedContent()
  {
    this.isLoading = true
    await this.contentService.getUserWatchedContents(localStorage.getItem('token') || '')
    this.isLoading = false
  }

  goToContentDetails(content: Content): void 
  {
    this.router.navigate(['/content', content.id], { state: { content: content } })
  }

  goBack()
  {
    this.location.back()
  }

}
