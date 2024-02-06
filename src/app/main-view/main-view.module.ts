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
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';


const routes: Routes = [
  {   path: 'home',   component: HomePageComponent, canActivate:[AuthGuardService]},
  {   path: 'gen-diet',   component: GenDietComponent , canActivate:[AuthGuardService]},
  {   path: 'recipes',   component: RecipesComponent , canActivate:[AuthGuardService]},
  {   path: 'recipes/:id',   component: RecipesComponent , canActivate:[AuthGuardService]},
  {   path: 'my-settings',   component: MySettingsComponent, canActivate:[AuthGuardService]},
  {   path: '', redirectTo:'home', pathMatch:'full'}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes), HttpClientModule, MatFormFieldModule, MatInputModule, MatFormFieldModule
  ],
  exports:[RouterModule],
  providers:[AuthGuardService, AuthService]
})
export class MainViewModule { }
