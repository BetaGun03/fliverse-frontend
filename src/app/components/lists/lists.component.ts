import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { List } from '../../interfaces/list';
import { AuthService } from '../../services/auth/auth.service';
import { ListService } from '../../services/list/list.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lists',
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {
  loading = true
  creatingList = false
  showNewListForm = false
  newListForm!: FormGroup

  constructor(public listService: ListService, private authService: AuthService, public router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) 
  {
    this.newListForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  async ngOnInit() 
  {
    this.loading = true
    this.listService.getLists()
    this.loading = false
  }

  createList() 
  {
    this.creatingList = true
    if (this.newListForm.invalid) return

    const token = this.authService.getToken() || ""

    if (!token) 
    {
      console.error("No token found, cannot create list")
      return
    }

    this.listService.createList(token, this.newListForm.value.name, this.newListForm.value.description)
      .then(() => {
        this.newListForm.reset()
        this.showNewListForm = false
        this.snackBar.open("List created successfully", "Close", { duration: 3000 })
      })
      .catch((error: any) => {
        console.error("Error creating list:", error)
      })
      .finally(() => {
        this.creatingList = false
      })
}

  goToList(list: List)
  {
    this.router.navigate(['/lists', list.id], { state: { list } })
  }
}
