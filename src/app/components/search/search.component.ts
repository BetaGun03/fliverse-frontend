import { Component, ViewChild } from '@angular/core'
import { ContentService } from '../../services/content/content.service'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Content } from '../../interfaces/content'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { CardComponent } from '../skeletons/card/card.component'
import { filter } from 'rxjs'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatChipsModule } from '@angular/material/chips'
import { MatNativeDateModule } from '@angular/material/core'

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CardComponent,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatNativeDateModule,
    MatChipsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  @ViewChild('drawer') drawer!: MatDrawer

  titleFromQuery = ''
  isLoading = false
  noResults = false
  skeletonArray: number[] = Array(10).fill(0)
  contents: Content[] = []
  searchInput = ''
  private lastTitleFromQuery = ''

  filters: {
    releaseDateFrom: Date | null
    releaseDateTo: Date | null
    keywords: string
    durationMin: number | null
    durationMax: number | null
  } = {
    releaseDateFrom: null,
    releaseDateTo: null,
    keywords: '',
    durationMin: null,
    durationMax: null
  }

  availableTypes: string[] = ['movie', 'series', 'all']
  selectedTypes: string[] = ["all"]

  availableGenres: string[] = [
    'Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'
  ]
  selectedGenres: string[] = []

  constructor(private contentService: ContentService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() 
  {
    this.route.queryParams.subscribe(params => {
      const newTitle = params['title'] || ''
      if (newTitle !== this.lastTitleFromQuery) 
      {
        this.titleFromQuery = newTitle
        this.lastTitleFromQuery = newTitle
        this.loadContents()
      }
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.titleFromQuery) 
      {
        this.loadContents()
      }
    })
  }

  private loadContents() 
  {
    const stateContents = history.state?.contents

    if (this.titleFromQuery) 
    {
      this.isLoading = true
      this.noResults = false

      // PASA LOS FILTROS TAMBIÉN AQUÍ
      this.contentService.searchContentsByTitle(
        this.titleFromQuery.trim(),
        this.selectedGenres,
        this.filters.keywords ? this.filters.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
        undefined,
        this.filters.releaseDateFrom ? new Date(this.filters.releaseDateFrom) : undefined,
        this.filters.releaseDateTo ? new Date(this.filters.releaseDateTo) : undefined,
        this.selectedTypes.length === 1 ? this.selectedTypes[0] : undefined,
        undefined,
        this.filters.durationMin !== null ? this.filters.durationMin : undefined,
        this.filters.durationMax !== null ? this.filters.durationMax : undefined
      )
        .then((result: { contents: Content[]; total: number; page: number; limit: number }) => {
          this.contents = result.contents
          this.noResults = result.contents.length === 0
        })
        .catch(error => {
          this.contents = []
          this.noResults = true
          console.error('Error searching contents:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
    else if (stateContents && Array.isArray(stateContents.contents)) 
    {
      this.contents = stateContents.contents
      this.noResults = this.contents.length === 0
      this.isLoading = false
    } 
    else if (stateContents && Array.isArray(stateContents) && stateContents.length === 0) 
    {
      this.contents = []
      this.noResults = true
      this.isLoading = false
    } 
    else if (stateContents === undefined) 
    {
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
      this.contents = []
      this.noResults = true
      this.isLoading = false
    }
  }

  onSearch() 
  {
    const title = this.searchInput.trim()

    this.isLoading = true
    this.noResults = false

    this.contentService.searchContentsByTitle(
      title,
      this.selectedGenres,
      this.filters.keywords ? this.filters.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
      undefined,
      this.filters.releaseDateFrom ? new Date(this.filters.releaseDateFrom) : undefined,
      this.filters.releaseDateTo ? new Date(this.filters.releaseDateTo) : undefined,
      this.selectedTypes.length === 1 ? this.selectedTypes[0] : undefined,
      undefined,
      this.filters.durationMin !== null ? this.filters.durationMin : undefined,
      this.filters.durationMax !== null ? this.filters.durationMax : undefined
    )
      .then((result: { contents: Content[]; total: number; page: number; limit: number }) => {
        this.contents = result.contents
        this.noResults = result.contents.length === 0

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { title: title || null },
          queryParamsHandling: 'merge'
        })
      })
      .catch(error => {
        this.contents = []
        this.noResults = true
        console.error('Error searching contents:', error)
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  goToContent(content: Content) {
    this.router.navigate(['/content', content.id], { state: { content: content } })
  }

  toggleType(type: string) 
  {
    if (this.selectedTypes.includes(type)) 
    {
      this.selectedTypes = []
    } 
    else 
    {
      this.selectedTypes = [type]
    }
  }

  toggleGenre(genre: string) 
  {
    const idx = this.selectedGenres.indexOf(genre)
    if (idx >= 0) 
    {
      this.selectedGenres.splice(idx, 1)
    } 
    else 
    {
      this.selectedGenres.push(genre)
    }
  }

  applyFilters() 
  {
     if (this.drawer) 
    {
      this.drawer.close()
    }
  }

}