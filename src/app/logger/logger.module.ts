import { LogViewComponent } from './log-view/log-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {   path: 'login',   component: LogViewComponent   }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports:[]
})
export class LoggerModule { }
