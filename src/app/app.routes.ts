import { Routes } from '@angular/router';
import { LoggerModule } from './logger/logger.module';
import { LogViewComponent } from './logger/log-view/log-view.component';

export const routes: Routes = [
  {path:'login',component:LogViewComponent},
  {path: '',redirectTo:'login',pathMatch:'full'}
];
