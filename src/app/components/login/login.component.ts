import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoogleloginComponent } from "../googlelogin/googlelogin.component";

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatCheckboxModule, MatInputModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, GoogleloginComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loading: boolean = false
  errorMsg: string | null = null
  loginForm!: FormGroup
  rememberMe: boolean = false

  constructor(public authService: AuthService, private fb: FormBuilder, private router: Router) 
  {
    // Initialize the login form with form controls and validators
    this.loginForm = this.fb.group({
      username: ['', [ Validators.required ] ],
      password: ['', [ Validators.required, Validators.minLength(8) ] ],
      rememberMe: [false]
    })
  }

  // Function to toggle the remember me checkbox
  changeRememberMe() 
  {
    this.rememberMe = !this.rememberMe
    this.loginForm.get('remember')?.setValue(this.rememberMe)
  }

  // Function to handle the login form submission
  async loginSubmit() 
  {
    // Reset the error message
    this.errorMsg = null

    // Check if the form is valid
    if (this.loginForm.invalid)
    { 
      return
    }

    this.loading = true
    const { username, password, rememberMe } = this.loginForm.value

    // Request the login using the auth service
    try {
      const token = await this.authService.login(username, password)

      if (rememberMe) 
      {
        localStorage.setItem('token', token)
      }
    
      this.router.navigate(['/'])
    } catch (e: any) {
      if (e.response && e.response.status === 404) 
      {
        this.errorMsg = "User not found."
      } 
      else if (e.response && e.response.status === 401) 
      {
        this.errorMsg = "Incorrect username or password."
      } 
      else 
      {
        this.errorMsg = "Error: " + (e.message || e)
      }
    }
    finally
    {
      this.loading = false
    }
    
  }

}
