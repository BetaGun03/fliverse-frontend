import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-add-content',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatProgressSpinnerModule, MatRadioModule],
  templateUrl: './add-content.component.html',
  styleUrl: './add-content.component.css'
})
export class AddContentComponent {

  loading: boolean = false
  addContentForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar, public contentService: ContentService)
  {
    this.addContentForm = this.fb.group({
      title: ['', [ Validators.required ] ],
      synopsis: ['', [ Validators.required, Validators.minLength(10) ] ],
      type: ['Movie', [ Validators.required ] ],
      poster: [null, [ Validators.required ] ],
      trailerUrl: ['', [ Validators.pattern('https?://.+') ]],
      releaseDate: [''],
      duration: ['', [ Validators.required, Validators.pattern('^[0-9]+$') ] ],
      genre: ['', [ Validators.required ] ],
      keywords: ['', [ Validators.required ] ],
    })
  }

  async addContentSubmit()
  {
    if(this.addContentForm.valid)
    {
      try{
        this.loading = true
        const formValue = this.addContentForm.value
        const token = localStorage.getItem('token') || ""

        // Create arrays from genre and keywords strings
        const genreArray = formValue.genre.split(',').map((g: string) => g.trim()).filter((g: string) => g)
        const keywordsArray = formValue.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k)

        // Create a content object
        const content = {
          title: formValue.title,
          type: formValue.type.toLowerCase(),
          synopsis: formValue.synopsis,
          trailer_url: formValue.trailerUrl,
          release_date: formValue.releaseDate && formValue.releaseDate.format ? formValue.releaseDate.format('YYYY-MM-DD') : formValue.releaseDate,
          duration: Number(formValue.duration),
          genre: genreArray,
          keywords: keywordsArray,
          posterFile: formValue.poster
        }

        await this.contentService.addNewContentToBackend(content, token)

        this.snackBar.open('Content added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        })

        this.router.navigate(['/'])
      }
      catch(error)
      {
        console.error('Error adding content:', error)
        this.snackBar.open('Failed to add content. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        })
      }
      finally
      {
        this.loading = false
      }
    }
    else{
      this.addContentForm.markAllAsTouched()

      this.snackBar.open('Please fill out all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      })
    }
    
  }

  onDragOver(event: DragEvent) 
  {
    event.preventDefault()
    event.stopPropagation()
  }

  onDragLeave(event: DragEvent) 
  {
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop(event: DragEvent) 
  {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer && event.dataTransfer.files.length > 0) 
    {
      const file = event.dataTransfer.files[0]
      this.addContentForm.get('poster')?.setValue(file)
      const fileInput = document.getElementById('file-input') as HTMLInputElement

      if (fileInput) 
      {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInput.files = dataTransfer.files
      }
    }
  }

  onFileSelected(event: Event) 
  {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) 
    {
      this.addContentForm.get('poster')?.setValue(input.files[0])
    }
  }
}
