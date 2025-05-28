import { Component } from '@angular/core';
import { Content } from '../../interfaces/content';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { ContentService } from '../../services/content/content.service';
import { ContentType } from '../../enums/content-type';
import { ContentskeletonComponent } from '../skeletons/contentskeleton/contentskeleton.component';
import { CommentsComponent } from '../comments/comments.component';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content',
  imports: [MatIcon, CommonModule, ContentskeletonComponent, CommentsComponent, FormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  id!: string
  isLoading: boolean = false
  public content!: Content
  userRating: number = 0 // Variable to store the user's rating
  hasUserRated: boolean = false // Flag to check if the user has rated the content
  userWatchedStatus: string = 'To watch' // Variable to store the user's watch status
  ratingOptions: number[] = Array.from({ length: 11 }, (_, i) => i) // Array of rating options from 0 to 10

  //AÑADIR A LISTAS

  constructor(private router: Router, private location: Location, private contentService: ContentService, private route: ActivatedRoute, public auth: AuthService) 
  { 
    this.id = this.route.snapshot.paramMap.get('id') as string || ''
    const navigation = this.router.getCurrentNavigation()
    this.content = navigation?.extras.state?.['content'] as Content

    if (this.content)
    {
      // If content is passed through navigation, set it directly
      this.contentService.getContentAverageRatingById(String(this.content.id))
        .then(averageRating => {
          this.content.average_rating = averageRating
        })
        .catch(err => {
          console.error('Error fetching average rating:', err)
          this.content.average_rating = 0 // Default to 0 if there's an error
        })
      this.isLoading = false

      // If the user is authenticated, fetch their rating for the content
      if (this.auth.isAuthenticated()) 
      {
        this.getUserRating()
      }
    } 
    else 
    {
      // If no content is passed, fetch it by ID
      this.isLoading = true
      if (this.id) 
      {
        this.contentService.getContentById(this.id)
          .then(content => {
            this.content = content
            this.isLoading = false

            // If the user is authenticated, fetch their rating for the content
            if (this.auth.isAuthenticated()) 
            {
              this.getUserRating()
            }
          })
          .catch(err => {
            console.error('Error fetching content by ID:', err)
            this.content = {
              id: Number(this.id),
              title: "Content not found",
              type: ContentType.MOVIE,
              synopsis: '',
              poster: '',
              release_date: new Date(),
              average_rating: 0,
              genre: [],
              duration: 0,
              trailer_url: '',
              keywords: []
            }
            this.isLoading = false
          })
      }
    }
  }

  async ngOnInit()
  {
    if (this.auth.isAuthenticated()) 
    {
      await this.getUserWatchedStatus()
    }
  }

  // Function to submit the user's rating to the backend using ContentService
  async submitRating() 
  {
    if (!this.auth.isAuthenticated())
    { 
      return
    }

    const token = this.auth.getToken?.() || ''

    try {
      if(this.hasUserRated)
      {
        await this.contentService.changeRatingForContent(String(this.content.id), this.userRating, token)
        alert('Your rating has been updated!')
      }
      else
      {
        await this.contentService.addRatingToContent(String(this.content.id), this.userRating, token)
        alert('Your rating has been submitted!')
      }

      // Update the content's average rating after submitting the new rating
      this.content.average_rating = await this.contentService.getContentAverageRatingById(String(this.content.id))
      this.hasUserRated = true
    } catch (err: any) {
      alert(err.message || 'Error submitting rating')
    }
  }

  // Function to fetch the user's rating for the content
  async getUserRating()
  {
    if (!this.auth.isAuthenticated())
    { 
      return
    }

    const token = this.auth.getToken?.() || ''

    try {
      const userRating = await this.contentService.getUserRatingForContent(String(this.content.id), token)
      this.userRating = userRating || 0 // Default to 0 if no rating found
      this.hasUserRated = userRating !== 0 // Check if the user has rated the content
    } catch (err: any) {
      console.error('Error fetching user rating:', err)
      alert(err.message || 'Error fetching your rating')
    }
  }

  // Function to fetch the user's current watch status for the content
  async getUserWatchedStatus()
  {
    if (!this.auth.isAuthenticated())
    { 
      return
    }

    const token = this.auth.getToken?.() || ''

    try {
      const watchStatus = await this.contentService.getUserWatchedStatus(String(this.content.id), token)
      if(watchStatus === 'to_watch')
      {
        this.userWatchedStatus = 'To watch'
      }
      else if(watchStatus === 'watched')
      {
        this.userWatchedStatus = 'Watched'
      }
      else
      {
        this.userWatchedStatus = 'To watch'
      }

    } catch (err: any) {
      console.error('Error fetching user watch status:', err)
      alert(err.message || 'Error fetching your watch status')
    }
  }

   async toggleWatchedStatus() 
   {
    if (!this.auth.isAuthenticated()) return

    const token = this.auth.getToken?.() || ''
    
    // Determine the new status based on the current one
    const newStatus = this.userWatchedStatus === 'Watched' ? 'to_watch' : 'watched'

    try {
      // Call the service to update the status
      await this.contentService.setUserWatchedStatus(String(this.content.id), newStatus, token)
      
      // Update the local status
      this.userWatchedStatus = newStatus === 'watched' ? 'Watched' : 'To watch'
    } catch (err: any) {
      alert(err.message || 'Error updating watched status')
    }
  }

  goBack() 
  {
    this.location.back()
  }

  addToList() 
  {
    alert('Added to your list!')
  }

}
