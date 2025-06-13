import { Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule }    from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';
import { MatMenuModule }    from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  searchTerm: string = ''
  selectedFilter: string = 'both'
  isSearchRoute: boolean = false

  constructor(private router: Router, public auth: AuthService, public contentService: ContentService) 
  {
    this.router.events.subscribe(() => {
      this.isSearchRoute = this.router.url.startsWith('/search')
    })
  }

  logout()
  {
    this.auth.logout()
  }

  async onSearch() 
  {
    const query = this.searchTerm.trim()

    if (query) 
    {
      // If movies filter is selected
      if(this.selectedFilter === 'movies') 
      {
        try{
          const movies = await this.contentService.searchContentsByTitle(query, [], [], undefined, undefined, undefined, "movie", undefined, undefined, undefined, undefined, undefined)
          
          if(movies.contents.length === 0)
          {
            this.router.navigate(['/search'], {
              queryParams: { title: query, type: 'movie' }, state: { contents: []  }
            })
          }
          else{
            this.router.navigate(['/search'], { 
              queryParams: { title: query, type: 'movie' }, 
              state: { contents: movies }
            })
          }
        }
        catch(e){
          console.error('Error occurred while searching:', e)
        }
      }
      // If series filter is selected
      else if(this.selectedFilter === 'series')
      {
        try{
          const series = await this.contentService.searchContentsByTitle(query, [], [], undefined, undefined, undefined, "series", undefined, undefined, undefined, undefined, undefined)

          if(series.contents.length === 0)
          {
            this.router.navigate(['/search'], {
              queryParams: { title: query, type: 'series' }, state: { contents: []  }
            })
          }
          else
          {
            this.router.navigate(['/search'], { 
              queryParams: { title: query, type: 'series' }, 
              state: { contents: series }
            })
          }
        }
        catch(e){
          console.error('Error occurred while searching:', e)
        }
      }
      // If both movies and series filters are selected
      else if(this.selectedFilter === 'both')
      {
        try{
          const contents = await this.contentService.searchContentsByTitle(query, [], [], undefined, undefined, undefined, "", undefined, undefined, undefined, undefined, undefined)

          if(contents.contents.length === 0)
          {
            this.router.navigate(['/search'], {
              queryParams: { title: query }, state: { contents: []  }
            })
          }
          else
          {
            this.router.navigate(['/search'], { 
              queryParams: { title: query }, 
              state: { contents }
            })
          }
        }
        catch(e){
          console.error('Error occurred while searching:', e)
        }
      }

      // Reset the search term and selected filter after navigation
      this.searchTerm = ''
      this.selectedFilter = 'both'
    }
  }

  // Function to handle filter selection. It updates the selectedFilter property.
  onFilterSelect(filter: string) 
  {
    this.selectedFilter = filter
  }

}
