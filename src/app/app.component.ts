import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [HeaderComponent, FooterComponent,RouterOutlet, CommonModule]
})
export class AppComponent {

  title = 'Fliverse'
  showHeader = true

  constructor(private router: Router, public auth: AuthService)
  {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHeader = event.urlAfterRedirects !== '/login' && event.urlAfterRedirects !== '/register'
      })
  }

  ngOnInit()
  {
    let token = localStorage.getItem("token")

    if(token)
    {
      this.auth.setToken(token)
      this.auth.changeLoginStatus(true)
    }
  }

}
