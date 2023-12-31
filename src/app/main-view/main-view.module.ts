import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { GenDietComponent } from './gen-diet/gen-diet.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MySettingsComponent } from './my-settings/my-settings.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {   path: 'home',   component: HomePageComponent},
  {   path: 'gen-diet',   component: GenDietComponent},
  {   path: 'recipes',   component: RecipesComponent},
  {   path: 'my-settings',   component: MySettingsComponent},
  {   path: '', redirectTo:'home', pathMatch:'full'}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class MainViewModule { }
