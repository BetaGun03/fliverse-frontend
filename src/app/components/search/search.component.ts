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
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatPaginatorModule } from '@angular/material/paginator'

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
    MatChipsModule,
    MatPaginatorModule
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
  totalResults = 0
  pageSize = 10
  currentPage = 1
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

  availableGenres: string[] = []
  selectedGenres: string[] = []

  constructor(private contentService: ContentService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) 
  {
    this.contentService.getContentGenres()
      .then(genres => {
        this.availableGenres = genres
      })
      .catch(error => {
        this.availableGenres = []
        console.error('Error fetching content genres:', error)
      })
  }

  ngOnInit() 
  {
    this.route.queryParams.subscribe(params => {
      // Title
      const newTitle = params['title'] || ''
      // Genres (can be string or array)
      const newGenres = params['genre']
        ? Array.isArray(params['genre']) ? params['genre'] : [params['genre']]
        : []
      // Keywords (can be string or array)
      const newKeywords = params['keywords']
        ? Array.isArray(params['keywords']) ? params['keywords'] : [params['keywords']]
        : []

      // Update local filters
      this.titleFromQuery = newTitle
      this.searchInput = newTitle
      this.selectedGenres = newGenres
      this.filters.keywords = newKeywords.join(',')

      // Start the search
      this.loadContents()
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.titleFromQuery && this.selectedGenres.length === 0 && !this.filters.keywords) {
        this.loadContents()
      }
    })
  }

  // Function to load contents based on the current state or query parameters.
  private loadContents(page: number = 1) 
  {
    const stateContents = history.state?.contents

    // Allow search if there is a title, genres, or keywords
    const hasTitle = this.titleFromQuery && this.titleFromQuery.trim() !== ''
    const hasGenres = this.selectedGenres && this.selectedGenres.length > 0
    const hasKeywords = this.filters.keywords && this.filters.keywords.split(',').map(k => k.trim()).filter(k => k).length > 0

    if (hasTitle || hasGenres || hasKeywords) 
    {
      this.isLoading = true
      this.noResults = false

      this.contentService.searchContentsByTitle(
        hasTitle ? this.titleFromQuery.trim() : undefined,
        this.selectedGenres,
        hasKeywords ? this.filters.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
        undefined,
        this.filters.releaseDateFrom ? new Date(this.filters.releaseDateFrom) : undefined,
        this.filters.releaseDateTo ? new Date(this.filters.releaseDateTo) : undefined,
        this.selectedTypes.length === 1 ? this.selectedTypes[0] : undefined,
        undefined,
        this.filters.durationMin !== null ? this.filters.durationMin : undefined,
        this.filters.durationMax !== null ? this.filters.durationMax : undefined,
        page,
        this.pageSize
      )
        .then((result: { contents: Content[]; total: number; page: number; limit: number }) => {
          this.contents = result.contents
          this.noResults = result.contents.length === 0
          this.totalResults = result.total
          this.currentPage = result.page
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
    // If there are contents in the navigation state, use them
    else if (stateContents && Array.isArray(stateContents.contents)) 
    {
      this.contents = stateContents.contents
      this.noResults = this.contents.length === 0
      this.isLoading = false
    } 
    // If the navigation state is an empty array, show no results
    else if (stateContents && Array.isArray(stateContents) && stateContents.length === 0) 
    {
      this.contents = []
      this.noResults = true
      this.isLoading = false
    } 
    // If there is no navigation state, show random contents
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
    // Default: show no results
    else 
    {
      this.contents = []
      this.noResults = true
      this.isLoading = false
    }
  }

  // Function to handle search input. Manually triggers the search when the user clicks the search button.
  onSearch(page: number = 1) 
  {
    const hasTitle = this.searchInput && this.searchInput.trim() !== ''
  const hasGenres = this.selectedGenres && this.selectedGenres.length > 0
  const hasKeywords = this.filters.keywords && this.filters.keywords.split(',').map(k => k.trim()).filter(k => k).length > 0

  if (!hasTitle && !hasGenres && !hasKeywords) 
  {
    this.snackBar.open('Please enter a title, genre or keyword to search', 'Close', { duration: 3000 })
    return
  }

  const title = hasTitle ? this.searchInput.trim() : undefined

  this.isLoading = true
  this.noResults = false

  this.contentService.searchContentsByTitle(
    title,
    this.selectedGenres,
    hasKeywords ? this.filters.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
    undefined,
    this.filters.releaseDateFrom ? new Date(this.filters.releaseDateFrom) : undefined,
    this.filters.releaseDateTo ? new Date(this.filters.releaseDateTo) : undefined,
    this.selectedTypes.length === 1 ? this.selectedTypes[0] : undefined,
    undefined,
    this.filters.durationMin !== null ? this.filters.durationMin : undefined,
    this.filters.durationMax !== null ? this.filters.durationMax : undefined,
    page,
    this.pageSize
  )
    .then((result: { contents: Content[]; total: number; page: number; limit: number }) => {
      this.contents = result.contents
      this.noResults = result.contents.length === 0
      this.totalResults = result.total
      this.currentPage = result.page

      // Actualiza todos los filtros en la URL
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          title: title || null,
          genre: this.selectedGenres.length > 0 ? this.selectedGenres : null,
          keywords: hasKeywords ? this.filters.keywords : null,
          releaseDateFrom: this.filters.releaseDateFrom ? this.filters.releaseDateFrom.toISOString() : null,
          releaseDateTo: this.filters.releaseDateTo ? this.filters.releaseDateTo.toISOString() : null,
          durationMin: this.filters.durationMin !== null ? this.filters.durationMin : null,
          durationMax: this.filters.durationMax !== null ? this.filters.durationMax : null,
          type: this.selectedTypes.length === 1 ? this.selectedTypes[0] : null,
          page: this.currentPage
        },
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

  goToContent(content: Content) 
  {
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

  // Change the page size and current page when the paginator changes.
  onPageChange(event: any) 
  {
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1
    this.onSearch(this.currentPage)
  }

  // Reset all filters and query parameters. Only if there are filters applied.
  resetFilters()
  {
    const hasFilters =
      this.titleFromQuery.trim() !== '' ||
      this.searchInput.trim() !== '' ||
      this.selectedGenres.length > 0 ||
      this.filters.keywords.trim() !== '' ||
      this.filters.releaseDateFrom !== null ||
      this.filters.releaseDateTo !== null ||
      this.filters.durationMin !== null ||
      this.filters.durationMax !== null ||
      (this.selectedTypes.length !== 1 || this.selectedTypes[0] !== 'all') ||
      this.currentPage !== 1

    if (!hasFilters) 
    {
      return
    }

    this.titleFromQuery = ''
    this.searchInput = ''
    this.selectedGenres = []
    this.filters = {
      releaseDateFrom: null,
      releaseDateTo: null,
      keywords: '',
      durationMin: null,
      durationMax: null
    }
    this.selectedTypes = ['all']
    this.currentPage = 1

    // Remove all filter-related query params from the URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        title: null,
        genre: null,
        keywords: null,
        releaseDateFrom: null,
        releaseDateTo: null,
        durationMin: null,
        durationMax: null,
        type: null,
        page: null
      },
      queryParamsHandling: ''
    })

    this.loadContents()
  }

}