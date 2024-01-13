import { LogViewComponent } from './log-view/log-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LogService } from './log.service';


const routes: Routes = [
  {   path: '',   component: LogViewComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ],
  exports:[RouterModule],
  providers: [LogService]
})
export class LoggerModule { }
