import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoogleloginComponent } from '../googlelogin/googlelogin.component';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatCheckboxModule, MatInputModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, GoogleloginComponent, RouterModule, MatDatepickerModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  rememberMe: boolean = false
  loading: boolean = false
  errorMsg: string | null = null
  registerForm!: FormGroup

  constructor(public authService: AuthService, private fb: FormBuilder, private router: Router) 
  {
    // Initialize the register form with form controls and validators
    this.registerForm = this.fb.group({
      username  : ['', [ Validators.required ] ],
      password  : ['', [ Validators.required, Validators.minLength(8) ] ],
      email     : ['', [ Validators.required, Validators.email ] ],
      name      : [''],
      birthdate : [ null ],
      profilePic: [ null ],
      rememberMe: [ false ]
    })
  }

  // Function to toggle the remember me checkbox
  changeRememberMe() 
  {
    this.rememberMe = !this.rememberMe
    this.registerForm.get('rememberMe')?.setValue(this.rememberMe)
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
      this.registerForm.get('profilePic')?.setValue(file)
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
      this.registerForm.get('profilePic')?.setValue(input.files[0])
    }
  }

  // Function to register the user into the db
  async registerSubmit() 
  {
    // Reset the error message
    this.errorMsg = null

    // Check if the form is valid
    if (this.registerForm.invalid)
    { 
      return
    }

    this.loading = true
    const { username, password, email, name, birthdate, profilePic, rememberMe } = this.registerForm.value

    // Request the register using the auth service
    try {
      const token = await this.authService.register(
      username,
      password,
      email || undefined,
      name || undefined,
      birthdate || undefined,
      profilePic || undefined
    )

      if (!rememberMe) 
      {
        localStorage.removeItem('token')
      }
      else
      {
        localStorage.setItem('token', token)
      }
    
      this.router.navigate(['/'])
    } catch (e: any) {
      if (e.response?.status === 409) 
      {
        this.errorMsg = "User already exists."
      } 
      else if (e.response?.status === 400) 
      {
        this.errorMsg = "Invalid data. Please review the form fields."
      } 
      else 
      {
        this.errorMsg = "Unkown error. Try again later."
        console.log(e)
      }
    }
    finally
    {
      this.loading = false
    }
  }

}
