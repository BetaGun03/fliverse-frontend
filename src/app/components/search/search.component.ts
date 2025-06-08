import { Component } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Content } from '../../interfaces/content';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from '../skeletons/card/card.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [CommonModule, MatCardModule, CardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  titleFromQuery: string = ''
  isLoading: boolean = false
  noResults: boolean = false
  skeletonArray: number[] = Array(10).fill(0)
  contents: Content[] = []

  constructor(private contentService: ContentService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void 
  {
    // Subscribe to query parameters to get the title from the URL
    this.route.queryParams.subscribe(params => {
      this.titleFromQuery = params['title'] || ''
      this.loadContents()
    })

    // Subscribe to router events to reload contents on navigation
    // This will ensure that the contents are reloaded when navigating back to this component after searching from another component
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadContents()
    })
  }

  private loadContents(): void 
  {
    const stateContents = history.state?.contents

    if (stateContents && Array.isArray(stateContents.contents)) 
    {
      this.contents = stateContents.contents
      this.noResults = this.contents.length === 0
      this.isLoading = false
    } 
    else if (stateContents && Array.isArray(stateContents) && stateContents.length === 0) 
    {
      // If contents is an empty array passed directly
      this.contents = []
      this.noResults = true
      this.isLoading = false
    } 
    else if (stateContents === undefined) 
    {
      // Only if nothing is passed, load random
      this.isLoading = true
      this.contentService.getRandomContents(10, [], [])
        .then(response => {
          this.contents = response
          this.noResults = response.length === 0
        })
        .catch(error => {
          console.error('Error fetching random contents:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    } 
    else 
    {
      // Fallback for unexpected format
      this.contents = []
      this.noResults = true
      this.isLoading = false
    }
  }

  goToContent(content: Content): void
  {
    this.router.navigate(['/content', content.id], { state: { content: content } })
  }


}
