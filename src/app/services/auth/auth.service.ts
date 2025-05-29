import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import axios from 'axios';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user!: User
  private isLoggedIn: boolean = false

  constructor(private router: Router, public snackBar: MatSnackBar) 
  {
    // Global axios interceptor to manage authentication errors. If the token is expired or invalid, it will log out the user and redirect to the login page.
    axios.interceptors.response.use(
      response => response,
      error => {
        if(error.response && error.response.status === 401 && ( error.response.data?.message === 'Token expired' || error.response.data?.message === 'Invalid token' || error.response.data?.message === 'Session terminated. Please log in again.' || error.response.data?.message === 'Authorization header missing' || error.response.data?.message === 'Invalid authorization format' || error.response.data?.message === 'Unauthorized' ))
        {
          console.log('Session expired or invalid token. Logging out...')
          this.snackBar.open('Session expired. Please log in again.', 'Close', {
            duration: 5000,
          })
          this.logout()
          this.router.navigate(['/login'])
        }
        return Promise.reject(error)
      }
    )
  }

  // Function to change the login status of the user
  public changeLoginStatus(status: boolean): void
  {
    this.isLoggedIn = status
  }

  // Function to change the user object
  public changeUser(user: User): void
  {
    this.user = user
  }

  // Function to set the user token
  public setToken(token: string): void
  {
    if (!this.user) 
    {
      this.user = { token: token } // Initialize user with token if it doesn't exist
    } 
    else 
    {
      this.user.token = token
    }
  }

  // Function to get the user token
  public getToken(): string | undefined
  {
    return this.user?.token
  }

  // Function to login the user using the API endpoint. It returns a Promise of the token
  async login(username: string, password: string): Promise<string>
  {
    const url = "https://api.fliverse.es/users/login"

    if(!username || !password)
    {
      throw new Error("Username and password are required")
    }
    else if(username.trim() === "" || password.trim() === "")
    {
      throw new Error("Username and password cannot be empty")
    }

    const response = await axios.post(url, {
      username: username,
      password: password
    })

    if (response.status !== 200) 
    {
      throw new Error("Invalid username or password")
    }

    this.user = {
      username: response.data.user.username,
      token: response.data.token,
    }
    
    this.isLoggedIn = true
    return response.data.token
  }

  // Function to register the user using the API endpoint. It returns a Promise of the token
  async register(username: string, password: string, email?: string, name?:string, birthdate?:Date, profilePic?:File): Promise<string>
  {
    const url = "https://api.fliverse.es/users/register"

    if(!username || !password)
    {
      throw new Error("Username and password are required")
    }
    else if(username.trim() === "" || password.trim() === "")
    {
      throw new Error("Username and password cannot be empty")
    }

    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    if(email)
    {
      formData.append("email", email)
    }

    if(name)
    {
      formData.append("name", name)
    }

    if(birthdate)
    {
      formData.append("birthdate", birthdate.toString())
    }

    if(profilePic)
    {
      formData.append("profile_pic", profilePic)
    }

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.status !== 201) 
    {
      throw new Error("Registration failed")
    }

    this.user = {
      username: response.data.user.username,
      token: response.data.token,
    }

    this.isLoggedIn = true
    return response.data.token
  }

  // Function to request user information using the API endpoint. It returns a Promise of the User object
  async requestUserInfo(): Promise<User>
  {
    let url = "https://api.fliverse.es/users/me"

    return this.user
  }

  // Function to logout the user. It clears the token from local storage and resets the user object
  logout(): void
  {
    localStorage.removeItem('token') // Remove token from local storage
    this.user = {} as User // Clear user object
    this.isLoggedIn = false
  }

  isAuthenticated(): boolean
  {
    return this.isLoggedIn
  }
}
