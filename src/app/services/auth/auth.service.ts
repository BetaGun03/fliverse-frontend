import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user!: User
  private isLoggedIn: boolean = false

  constructor() { }

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

  logout(): void
  {
    this.isLoggedIn = false
  }

  isAuthenticated(): boolean
  {
    return this.isLoggedIn
  }
}
