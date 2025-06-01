import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListService } from '../../services/list/list.service';
import { UserInfoSkeletonComponent } from '../skeletons/user-info-skeleton/user-info-skeleton.component';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, UserInfoSkeletonComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

  isLoggingOut: boolean = false
  isLoggingOutAll: boolean = false
  isChangingInfo: boolean = false
  isLoading: boolean = true
  editForm!: FormGroup
  showEditForm: boolean = false
  selectedProfilePicName: string | null = null

  constructor(public authService: AuthService, public location: Location, public router: Router, private fb: FormBuilder, public snackBar: MatSnackBar, public listService: ListService)
  {
    this.loadUserInfo()
  }

  // Custom validator for YYYY-MM-DD format
  static birthdateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null
    const regex = /^\d{4}-\d{2}-\d{2}$/
    return regex.test(control.value) ? null : { invalidBirthdate: true }
  }

  // This function formats a Date object to a string in YYYY-MM-DD format
  private formatDateForInput(date: Date): string
  {
    if (!date) return ''
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // This function loads the user information from the AuthService and initializes the edit form
  private loadUserInfo()
  {
    this.authService.requestUserInfo().then(user => {
      this.editForm = this.fb.group({
        email: [user.email ?? '', [Validators.email]],
        name: [user.name ?? ''],
        birthdate: [
          user.birthdate ? this.formatDateForInput(user.birthdate) : '',
          [UserInfoComponent.birthdateValidator]
        ],
        password: ['', [Validators.minLength(8)]],
        profilePicFile: [null]
      })
      this.isLoading = false
    }).catch(error => {
      console.error('Error fetching user info:', error)
      this.isLoading = false
    })
  }

  logout() 
  {
    this.isLoggingOut = true
    this.authService.logout().then(() => {
      this.router.navigate(['/'])
    }).catch(error => {
      console.error('Error logging out:', error)
    }).finally(() => {
      this.isLoggingOut = false
    })
  }

  logoutAllDevices()
  {
    this.isLoggingOutAll = true
    this.authService.logoutAllDevices().then(() => {
      this.router.navigate(['/'])
    }).catch(error => {
      console.error('Error logging out from all devices:', error)
    }).finally(() => {
      this.isLoggingOutAll = false
    })
  }

  // This function opens the edit form
  openEditForm()
  {
    this.showEditForm = true
  }

  // This function closes the edit form and resets it
  cancelEdit()
  {
    this.showEditForm = false
    this.editForm.reset()
    this.selectedProfilePicName = null
    this.loadUserInfo()
  }

  // This function submits the edit form to update user information
  editUserInfo()
  {
    if (this.editForm.invalid) return

    this.isChangingInfo = true
    const formValue = this.editForm.value

    // Convert birthdate string to Date if valid
    let birthdate: Date | undefined = undefined
    if (formValue.birthdate && UserInfoComponent.birthdateValidator({ value: formValue.birthdate } as AbstractControl) === null) 
    {
      const [year, month, day] = formValue.birthdate.split('-').map(Number)
      birthdate = new Date(Date.UTC(year, month - 1, day))
    }

    // Build the User object only with editable fields
    const user: User = {
      token: this.authService.getUser().token,
      email: formValue.email || undefined,
      name: formValue.name || undefined,
      birthdate: birthdate,
      password: formValue.password || undefined,
      profilePicFile: formValue.profilePicFile || undefined
    }

    this.authService.editUserInfo(user)
      .then(updatedUser => {
        // If password is changed and is at least 8 characters, log out the user
        if (formValue.password && formValue.password.length >= 8) 
        {
          this.authService.changeUser({} as User)
          localStorage.removeItem('token')
          this.listService.setLists([])
          this.authService.changeLoginStatus(false)
          this.snackBar.open('Password changed successfully. Please log in again.', 'Close', {
            duration: 5000
          })
          this.router.navigate(['/login'])
          return
        }
        else
        {
          this.snackBar.open('User information updated successfully.', 'Close', {
            duration: 3000
          })
        }
        this.authService.changeUser(updatedUser)
        this.editForm.patchValue({ password: '', profilePicFile: null })
        this.showEditForm = false
        this.loadUserInfo()

      })
      .catch(error => {
        console.error('Error updating user info:', error)
      })
      .finally(() => {
        this.isChangingInfo = false
      })
  }

  // This function handles the profile picture file change event
  onProfilePicChange(event: any) 
  {
    const file = event.target.files[0]

    if (file) 
    {
      this.editForm.patchValue({ profilePicFile: file })
      this.selectedProfilePicName = file.name
    }
    else
    {
      this.selectedProfilePicName = null
    }
  }

  // This function handles the drag over event for profile picture upload
  onDragOver(event: DragEvent) 
  {
    event.preventDefault()
    event.stopPropagation()
  }

  // This function handles the drag leave event
  onDragLeave(event: DragEvent) 
  {
    event.preventDefault()
    event.stopPropagation()
  }

  // This function handles the drop event for profile picture upload
  onDrop(event: DragEvent) 
  {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer && event.dataTransfer.files.length > 0) 
    {
      const file = event.dataTransfer.files[0]
      this.editForm.patchValue({ profilePicFile: file })
      this.selectedProfilePicName = file.name
    }
  }

  goBack() 
  {
    this.location.back()
  }

}