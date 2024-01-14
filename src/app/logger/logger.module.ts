import { LogViewComponent } from './log-view/log-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LogService } from './log.service';
import { AuthGuardService } from '../auth-guard.service';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';


const routes: Routes = [
  {   path: '',   component: LogViewComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ],
  exports:[RouterModule],
  providers: [LogService, AuthGuardService, AuthService,HttpClient]
})
export class LoggerModule { }
