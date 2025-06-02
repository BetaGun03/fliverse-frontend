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

@Component({
  selector: 'app-add-content',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatProgressSpinnerModule, MatRadioModule],
  templateUrl: './add-content.component.html',
  styleUrl: './add-content.component.css'
})
export class AddContentComponent {

  loading: boolean = false
  addContentForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar)
  {
    this.addContentForm = this.fb.group({
      title: ['', [ Validators.required ] ],
      synopsis: ['', [ Validators.required, Validators.minLength(10) ] ],
      type: ['Movie', [ Validators.required ] ],
      poster: [null, [ Validators.required ] ],
      trailerUrl: [''],
      releaseDate: [''],
      duration: ['', [ Validators.required, Validators.pattern('^[0-9]+$') ] ],
      genre: ['', [ Validators.required ] ],
      keywords: ['', [ Validators.required ] ],
    })
  }

  /*async*/ addContentSubmit()
  {
    if(this.addContentForm.valid)
    {
      console.log(this.addContentForm.value)
    }
    else{
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
