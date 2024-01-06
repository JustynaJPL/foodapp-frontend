import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-log-view',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule

  ],
  templateUrl: './log-view.component.html',
  styleUrl: './log-view.component.scss'
})
export class LogViewComponent {
  login = new FormControl('', [Validators.required]);
  haslo = new FormControl('', [Validators.required]);

  getErrorMessage() {
    if ((this.login.hasError('required')) || (this.haslo.hasError('required')) ) {
      return 'Musisz podać dane';
    }


    return this.login.hasError('email') ? 'Musisz podać dane' : '';
  }
}
