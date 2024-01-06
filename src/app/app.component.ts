import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoggerModule } from './logger/logger.module';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, FooterComponent, NavigationComponent,
    MatSidenavModule, MatButtonModule
    ],
  templateUrl: './app.component.html',
  schemas:[],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  showFiller = false;
}
