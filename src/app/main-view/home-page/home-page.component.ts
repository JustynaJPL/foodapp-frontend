import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ChartComponent,  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';

import {Sort, MatSortModule} from '@angular/material/sort';

import { FoodItem } from './FoodItem';

import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};



@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule,
    MatGridListModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [ { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }]

})
export class HomePageComponent {

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  @ViewChild("chartdonut")
  chartdonut!: ChartComponent;
  public chartOptionsPie: Partial<ChartOptionsPie>;

  public currentDate = new Date();



  public fooditems: FoodItem[] = [
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 },
    {name: 'Frozen yogurt', calories: 159,protein: 4, fat: 6, carbs: 24,fiber:0 }
  ]
  sortedData!: FoodItem[];

  constructor(){
    this.chartOptionsPie = {
      series: [10,50,40],
      chart: {
        type: "donut"
      },
      labels: ["Węglowodany", "Tłuszcze", "Białko"],
      responsive: [
        {
          breakpoint: 300,
          options: {
            chart: {
              width: 100
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


  }

  sortData(sort: Sort) {
    const data = this.fooditems.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'calories':
          return this.compare(a.calories, b.calories, isAsc);
        case 'fat':
          return this.compare(a.fat, b.fat, isAsc);
        case 'carbs':
          return this.compare(a.carbs, b.carbs, isAsc);
        case 'protein':
          return this.compare(a.protein, b.protein, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

