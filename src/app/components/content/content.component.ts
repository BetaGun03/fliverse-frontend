import { Component } from '@angular/core';
import { Content } from '../../interfaces/content';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  public content!: Content

  constructor(private router: Router) 
  { 
    const navigation = this.router.getCurrentNavigation()
    this.content = navigation?.extras.state?.['content'] as Content
  }

}
