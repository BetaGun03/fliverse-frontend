import { CanActivateFn, CanMatchFn, Router, UrlTree, Route, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const snackBar = inject(MatSnackBar)

  if (authService.isAuthenticated() && localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null)
  {
    return true
  }
  snackBar.open('You must be logged in to access this page', 'Close', { duration: 3000 })
  return router.createUrlTree(['/login'])
}

export const authMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated() && localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null) 
  {
    return true
  }
  return router.createUrlTree(['/login'])
}