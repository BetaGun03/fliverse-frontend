import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PrivacypoliciesComponent } from './components/privacypolicies/privacypolicies.component';
import { ServiceconditionsComponent } from './components/serviceconditions/serviceconditions.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "content/:id", loadComponent: () => import('./components/content/content.component').then(m => m.ContentComponent) },
    { path: "privacypolicies", component: PrivacypoliciesComponent },
    { path: "termsofservice", component: ServiceconditionsComponent },
];
