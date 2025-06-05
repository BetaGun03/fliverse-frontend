import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { List } from '../../interfaces/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Content } from '../../interfaces/content';
import { ListService } from '../../services/list/list.service';
import { ListDetailsSkeletonComponent } from '../skeletons/list-details-skeleton/list-details-skeleton.component';

@Component({
  selector: 'app-list-details',
  imports: [CommonModule, MatCardModule, MatIconModule, ListDetailsSkeletonComponent],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.css'
})
export class ListDetailsComponent {

  list!: List
  isLoading: boolean = false

  constructor(public router: Router, public listService: ListService)
  {
    const navigation = this.router.getCurrentNavigation()
    const navList = navigation?.extras.state?.['list']
    if (navList) 
    {
      this.loadList(navList.id)
    }
  }

  // Load the list by ID
  async loadList(listId: number) 
  {
    this.isLoading = true
    const token = localStorage.getItem('token') || ''
    const lists = await this.listService.getUserLists(token)
    const found = lists.find(l => l.id === listId)

    if (found) 
    {
      this.list = found
    }
    this.isLoading = false
  }

  goToContentDetails(content: Content): void 
  {
    this.router.navigate(['/content', content.id], { state: { content: content } })
  }

}
