import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule,
} from "ng-apexcharts";
import ApexCharts from "apexcharts";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { LogService } from "../../logger/log.service";
import { MySettingsDataService } from "./my-settings-data.service";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Observable, catchError, map, of, take } from "rxjs";

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

interface UserDataDB {
  username: string;
  name: string;
  gender: string;
  height: number;
  birth: Date;
  sport: string;
}

interface Entry<T> {
  id: number;
  attributes: T;
}

interface Response {
  data: Entry<UserDataDB>[];
}

@Component({
  selector: "app-my-settings",
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatGridListModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: "./my-settings.component.html",
  styleUrl: "./my-settings.component.scss",
  providers: [],
})

// TODO:dodac dane z backendu do danych i do wykresów
export class MySettingsComponent implements OnInit {

  @ViewChild("chart")
  chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  @ViewChild("chartdonut")
  chartdonut!: ChartComponent;
  public chartOptionsPie!: Partial<ChartOptionsPie>;

  userdataDB$: Observable<UserDataDB[]> | undefined;
  error!: HttpErrorResponse;

  thisUserData!: UserDataDB;

  constructor(private http: HttpClient) {
    this.setinitialDataForCharts();
  }

  ngOnInit(): void {
    const url = "http://localhost:1337/api/users";
    const opts = {
      params: { populate: "*"},
      headers:
      {Authorization: `Bearer ${localStorage.getItem('token')}`}
    };

    this.userdataDB$ = this.http.get<Response>(url, opts).pipe(
      catchError((error) => this.handleError(error)),
      map((response) => response.data.map((x) => x.attributes))
    );

    // this.thisUserData = this.userdataDB$.subscribe(
    //   value =>

    // )


  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error;
    return of();
  }

  private setinitialDataForCharts() {
    this.chartOptions = {
      series: [
        {
          name: "Moja waga",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Wykres mojej wagi",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    };

    // konstruktor do wykresu kołowego gda
    this.chartOptionsPie = {
      series: [10, 50, 40],
      chart: {
        type: "donut",
      },
      labels: ["Węglowodany", "Tłuszcze", "Białko"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }

  getData():any{
    return this.userdataDB$?.subscribe();


  }



}
