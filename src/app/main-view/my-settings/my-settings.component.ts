import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


@Component({
  selector: 'app-my-settings',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule,
            MatGridListModule,MatDividerModule, MatCardModule, MatButtonModule, MatIconModule,MatProgressBarModule
  ],
  templateUrl: './my-settings.component.html',
  styleUrl: './my-settings.component.scss'
})

// TODO:dodac dane z backendu do danych i do wykresów

export class MySettingsComponent {
  @ViewChild("chart")
  chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chartdonut")
  chartdonut!: ChartComponent;
  public chartOptionsPie: Partial<ChartOptionsPie>;

  constructor() {
    // konstruktor do wykresu danych z wagi
    this.chartOptions = {
      series: [
        {
          name: "Moja waga",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels:{
        enabled:true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Wykres mojej wagi"
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
      }
    };

    // konstruktor do wykresu kołowego gda
    this.chartOptionsPie = {
      series: [10,50,40],
      chart: {
        type: "donut"
      },
      labels: ["Węglowodany", "Tłuszcze", "Białko"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


  }







}
