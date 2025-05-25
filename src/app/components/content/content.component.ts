import { Component } from '@angular/core';
import { Content } from '../../interfaces/content';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { ContentService } from '../../services/content/content.service';
import { ContentType } from '../../enums/content-type';

@Component({
  selector: 'app-content',
  imports: [MatIcon, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  id!: string
  isLoading: boolean = false
  public content!: Content

  //AÑADIR QUE EL USUARIO PUNTUE EL CONTENIDO
  //AÑADIR COMENTARIOS

  constructor(private router: Router, private location: Location, private contentService: ContentService, private route: ActivatedRoute) 
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

  goBack() 
  {
    this.location.back()
  }

  addToList() 
  {
    alert('Added to your list!')
  }

}
