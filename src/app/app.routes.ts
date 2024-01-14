import { Routes } from '@angular/router';
import { LoggerModule } from './logger/logger.module';
import { LogViewComponent } from './logger/log-view/log-view.component';
import { AuthGuardService } from './auth-guard.service';

export const routes: Routes = [
  {path:'login', loadChildren: () => import('./logger/logger.module').then(m => m.LoggerModule)},
  {path:'main', loadChildren: () => import('./main-view/main-view.module').then(m => m.MainViewModule)},
  {path: '',redirectTo:'login',pathMatch:'full'}
];
