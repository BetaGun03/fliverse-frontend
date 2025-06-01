import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { ListService } from '../../services/list/list.service';
import { ContentService } from '../../services/content/content.service';

declare const google: any

@Component({
  selector: 'app-googlelogin',
  imports: [CommonModule],
  templateUrl: './googlelogin.component.html',
  styleUrl: './googlelogin.component.css'
})
export class GoogleloginComponent {

  isLoading: boolean = false

  constructor(private router: Router, private auth: AuthService, private ngZone: NgZone, private listService: ListService, private contentService: ContentService) { }

  ngOnInit()
  {
    // 1) Expose the callback function on window so GSI can find it
    (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this)

    // 2) Initialize Google Identity Services using that function as callback
    google.accounts.id.initialize({
      client_id: '375918321013-hlldlhkcasc64hvh21k25a6jidu621os.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      use_fedcm_for_prompt: true     // Enables FedCM in Chrome 120+
    })

    // 3) Render the button inside <div id="g_id_signin">
    google.accounts.id.renderButton(
      document.getElementById('g_id_signin'),
      { theme: 'outline', size: 'large' }
    )

    // 4) (Optional) automatically show the One Tap prompt
    google.accounts.id.prompt() // shows the One Tap dialog
  }


  // 5) This function will receive the response object when the user accepts
  handleCredentialResponse(response: any) 
  {
    this.ngZone.run(() => {

      // Show loading spinner
      this.isLoading = true

      // Decode the JWT payload to extract email/name, etc.
      const payload = this.decodeJwtResponse(response.credential)

      // Send the token to the backend to verify it and create a session
      fetch('https://api.fliverse.es/users/loginGoogle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      })
      .then(r => r.json())
      .then(async data => {
        await new Promise(res => setTimeout(res, 2000));

        let user: User = {
          username: payload.email.split("@")[0],
          token: data.bdtoken
        }
        localStorage.setItem('token', data.bdtoken)
        this.auth.changeLoginStatus(true)
        this.auth.changeUser(user)

        // Fetch user lists when the user logs in
        this.listService.getUserLists(data.bdtoken)
          .then(lists => {
            if (lists.length === 0)
            {
              this.listService.setLists([])
              console.log('No lists found for the user.')
            }
            else
            {
              this.listService.setLists(lists)
            } 
          })
          .catch(err => {
            console.error('Error fetching user lists:', err)
          })

        // Fetch user watched contents
        this.contentService.getUserWatchedContents(data.bdtoken)
          .then(watchedContents => {
            this.contentService.setWatchedContents(watchedContents)
          })
          .catch(err => {
            console.error('Error fetching user watched contents:', err)
          })

        this.router.navigate(['/'])
      })
      .catch(async error => {
        let message = 'Unknown error occurred during Google login.'

        if (error instanceof Response) 
        {
          const text = await error.text()
          switch (error.status) 
          {
            case 400:
              message = 'Invalid data'
              break;
            case 401:
              message = 'Invalid or expired token. Please try logging in again.'
              break;
            case 409:
              message = 'User already exists with that email. Please try logging in with your password.'
              break;
            default:
              message = text || message
          }
        } 
        else if (error instanceof Error) 
        {
          message = error.message
        }
        console.error(message)
        alert(message)
      })
      .finally(() => {
        this.isLoading = false // Hide loading spinner
      })
    })
  }

  // Standard function to decode JWT in JavaScript
  decodeJwtResponse(token: string) 
  {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  }

}
