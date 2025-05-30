import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, MatIconModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

  constructor(public authService: AuthService, public location: Location, public router: Router)
  {
    this.authService.requestUserInfo().then(() => {
    }).catch(error => {
      console.error('Error fetching user info:', error)
    })
  }

  goBack() 
  {
    this.location.back()
  }

}
