import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  private collapsenavi = false;

  public toggleNaviMenu():void{
    this.collapsenavi = !this.collapsenavi;
  }

  public gettogglenavi():boolean{
    return this.collapsenavi;
  }

}
