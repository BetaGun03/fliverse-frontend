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
  ratingOptions: number[] = Array.from({ length: 11 }, (_, i) => i) // Array of rating options from 0 to 10

  //AÑADIR A LISTAS
  //AÑADIR ESTADO DE VISIONADO
  //AÑADIR SELECTOR ESTADO VISIONADO

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

  // Function to submit the user's rating to the backend using ContentService
  async submitRating() 
  {
    if (!this.auth.isAuthenticated())
    { 
      return
    }

    const token = this.auth.getToken?.() || ''

    try {
      await this.contentService.addRatingToContent(String(this.content.id), this.userRating, token)
      alert('Your rating has been submitted!')

      // Update the content's average rating after submitting the new rating
      this.content.average_rating = await this.contentService.getContentAverageRatingById(String(this.content.id))
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
    } catch (err: any) {
      console.error('Error fetching user rating:', err)
      alert(err.message || 'Error fetching your rating')
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
