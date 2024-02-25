import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoggerModule } from './logger/logger.module';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, FooterComponent, NavigationComponent,
    MatSidenavModule, MatButtonModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule,
    HttpClientModule
    ],
  templateUrl: './app.component.html',
  schemas:[],
  styleUrl: './app.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, AuthGuardService, AuthService
  ]
})
export class AppComponent {
  title = 'frontend';
  showFiller = false;
}
