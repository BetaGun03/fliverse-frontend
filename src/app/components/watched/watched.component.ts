import { Component } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Content } from '../../interfaces/content';

@Component({
  selector: 'app-watched',
  imports: [MatIconModule, CommonModule],
  templateUrl: './watched.component.html',
  styleUrl: './watched.component.css'
})
export class WatchedComponent {

  constructor(public contentService: ContentService, public router: Router) { }

  goToContentDetails(content: Content): void 
  {
    this.router.navigate(['/content', content.id], { state: { content: content } })
  }

}
