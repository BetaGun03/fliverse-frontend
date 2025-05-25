import { Component } from '@angular/core';
import { Content } from '../../interfaces/content';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-content',
  imports: [MatIcon, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  isLoading: boolean = false
  public content!: Content

  //AÑADIR QUE EL USUARIO PUNTUE EL CONTENIDO
  //AÑADIR COMENTARIOS

  constructor(private router: Router, private location: Location, private contentService: ContentService, private route: ActivatedRoute) 
  { 
    const navigation = this.router.getCurrentNavigation()
    this.content = navigation?.extras.state?.['content'] as Content

    this.contentService.getContentAverageRatingById(String(this.content.id))
    .then(rating => {
      this.content.average_rating = rating
    })
    

    // If content is not provided in the state, fetch it by ID from the route parameters
    if (!this.content) 
    {
      this.isLoading = true
      const id = this.route.snapshot.paramMap.get('id')

      if (id) 
      {
        this.contentService.getContentById(id)
          .then(content => {
            this.content = content
            this.isLoading = false
          })
          .catch(err => {
            console.error('Error fetching content by ID:', err)
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
