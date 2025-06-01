import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { ListService } from './services/list/list.service';
import { ContentService } from './services/content/content.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [HeaderComponent, FooterComponent,RouterOutlet, CommonModule]
})
export class AppComponent {

  title = 'Fliverse'
  showHeader = true

  constructor(private router: Router, public auth: AuthService, private listService: ListService, private contentService: ContentService)
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

      // Fetch user lists if the user is authenticated
      this.listService.getUserLists(token)
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

        this.contentService.getUserWatchedContents(token)
          .then(watchedContents => {
            this.contentService.setWatchedContents(watchedContents)
          })
          .catch(err => {
            console.error('Error fetching user watched contents:', err)
          })
    }
  }

}
