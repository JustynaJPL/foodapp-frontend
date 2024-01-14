import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { GenDietComponent } from './gen-diet/gen-diet.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MySettingsComponent } from './my-settings/my-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {   path: 'home',   component: HomePageComponent, canActivate:[AuthGuardService]},
  {   path: 'gen-diet',   component: GenDietComponent , canActivate:[AuthGuardService]},
  {   path: 'recipes',   component: RecipesComponent , canActivate:[AuthGuardService]},
  {   path: 'my-settings',   component: MySettingsComponent, canActivate:[AuthGuardService]},
  {   path: '', redirectTo:'home', pathMatch:'full'}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes), HttpClientModule
  ],
  exports:[RouterModule],
  providers:[AuthGuardService, AuthService]
})
export class MainViewModule { }
