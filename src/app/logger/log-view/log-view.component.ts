import { LogService } from './../log.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  styleUrl: './log-view.component.scss',
  providers:[LogService]
})
export class LogViewComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  isOK: Boolean;

  constructor(private _logService: LogService){
    this.isOK = true;

  }

  submit(){
    //tutaj są przenoszone dane z logowania do servisu
    //generuje się też token do danych
    this.isOK = this._logService.submitlogindata(this.form.get('username')?.value ,this.form.get('password')?.value);
  }





}
