import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PrivacypoliciesComponent } from './components/privacypolicies/privacypolicies.component';
import { ServiceconditionsComponent } from './components/serviceconditions/serviceconditions.component';
import { ListDetailsComponent } from './components/list-details/list-details.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "content/:id", loadComponent: () => import('./components/content/content.component').then(m => m.ContentComponent) },
    { path: "privacypolicies", component: PrivacypoliciesComponent },
    { path: "termsofservice", component: ServiceconditionsComponent },
    { path: "login", loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: "register", loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
    { path: "lists", loadComponent: () => import('./components/lists/lists.component').then(m => m.ListsComponent) },
    { path: 'lists/:id', component: ListDetailsComponent }
];
