import { Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule }    from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';
import { MatMenuModule }    from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchTerm: string = ''
  selectedFilter: string = 'both'

  constructor(private router: Router, private auth: AuthService) {}

  onSearch() {
    const query = this.searchTerm.trim()
    if (query) {
      // Por ejemplo, navegar a /search?q=...
      this.router.navigate(['/search'], { queryParams: { q: query } })
    }
  }

  onFilterSelect(filter: string) {
    this.selectedFilter = filter;
    // Aquí puedes hacer lo que necesites con el filtro seleccionado
    // Por ejemplo, lanzar una búsqueda automática, emitir un evento, etc.
    // console.log('Filtro seleccionado:', filter);
  }
}
