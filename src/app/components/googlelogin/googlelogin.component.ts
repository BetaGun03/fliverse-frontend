import { Component } from '@angular/core';
import { Router } from '@angular/router';

declare const google: any

@Component({
  selector: 'app-googlelogin',
  imports: [],
  templateUrl: './googlelogin.component.html',
  styleUrl: './googlelogin.component.css'
})
export class GoogleloginComponent {

  constructor(private router: Router) { }

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
    // Decode the JWT payload to extract email/name, etc.
    const payload = this.decodeJwtResponse(response.credential);

    // Send the token to the backend to verify it and create a session
    fetch('https://api.fliverse.es/users/loginGoogle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
    })
    .then(r => r.json())
    .then(data => {
      localStorage.setItem('token', data.bdtoken)
    })
    
    this.router.navigate(['/'])
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
