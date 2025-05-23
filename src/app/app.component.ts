import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [HeaderComponent, FooterComponent,RouterOutlet, CommonModule]
})
export class AppComponent {
  title = 'tfg-frontend'
  showHeader = true

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHeader = event.urlAfterRedirects !== '/login' && event.urlAfterRedirects !== '/register'
      });
  }
}
