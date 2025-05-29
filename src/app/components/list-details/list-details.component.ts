import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { List } from '../../interfaces/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Content } from '../../interfaces/content';

@Component({
  selector: 'app-list-details',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.css'
})
export class ListDetailsComponent {

  list!: List

  constructor(public router: Router)
  {
    const navigation = this.router.getCurrentNavigation()
    this.list = navigation?.extras.state?.['list']
  }

  goToContentDetails(content: Content): void 
  {
    this.router.navigate(['/content', content.id], { state: { content: content } })
  }

}
