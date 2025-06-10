import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PrivacypoliciesComponent } from './components/privacypolicies/privacypolicies.component';
import { ServiceconditionsComponent } from './components/serviceconditions/serviceconditions.component';
import { ListDetailsComponent } from './components/list-details/list-details.component';
import { authGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "content/:id", loadComponent: () => import('./components/content/content.component').then(m => m.ContentComponent) },
    { path: "privacypolicies", component: PrivacypoliciesComponent },
    { path: "termsofservice", component: ServiceconditionsComponent },
    { path: "login", loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: "register", loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
    { path: "lists", loadComponent: () => import('./components/lists/lists.component').then(m => m.ListsComponent), canActivate: [authGuard], canMatch: [authGuard] },
    { path: 'lists/:id', component: ListDetailsComponent, canActivate: [authGuard], canMatch: [authGuard] },
    { path: "user", loadComponent: () => import('./components/user-info/user-info.component').then(m => m.UserInfoComponent), canActivate: [authGuard], canMatch: [authGuard] },
    { path: "watched", loadComponent: () => import('./components/watched/watched.component').then(m => m.WatchedComponent), canActivate: [authGuard], canMatch: [authGuard] },
    { path: "addcontent", loadComponent: () => import('./components/add-content/add-content.component').then(m => m.AddContentComponent), canActivate: [authGuard], canMatch: [authGuard] },
    { path: "search", loadComponent: () => import('./components/search/search.component').then(m => m.SearchComponent) },
    { path: "help", loadComponent: () => import('./components/help/help.component').then(m => m.HelpComponent) }
];
