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
import { param } from "jquery";

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
  gda:GDA
}

interface GDA {
  bialka:number;
  kcal:number;
  tluszcze:number;
  weglowodany:number;

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
// konstruktor do wykresu kołowego gda
getBMI // konstruktor do wykresu kołowego gda
() {

}
getAge() {

}
  @ViewChild("chart")
  chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  @ViewChild("chartdonut")
  chartdonut!: ChartComponent;
  public chartOptionsPie!: Partial<ChartOptionsPie>;
  error!: HttpErrorResponse;

  userData: UserDataDB = {
    username: "",
    name: "",
    gender: "",
    height: 0,
    birth: new Date(),
    sport: "",
    gda:{
      bialka:0,
      kcal:0,
      tluszcze:0,
      weglowodany:0
    }

  };

  private url = "http://localhost:1337/api/users/";
  private opts = {
    params: { populate: "*" },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  constructor(private http: HttpClient) {
    this.getDataFromStrapi();
    this.setinitialDataForCharts();

  }

  ngOnInit(): void {

  }

  getDataFromStrapi() {
    this.http
      .get(this.url + localStorage.getItem("userId"), this.opts)
      .subscribe(
        (data: any) => {
          console.log("Data from Strapi:", data);
          // Handle the data as needed
          this.userData.username = data.username;
          this.userData.name = data.name;
          this.userData.gender = data.gender;
          this.userData.height = data.height;
          this.userData.birth = data.birth;
          this.userData.sport = data.sport;
          this.userData.gda.kcal = data.gda.kcal;
          this.userData.gda.bialka = data.gda.bialka;
          this.userData.gda.tluszcze = data.gda.tluszcze;
          this.userData.gda.weglowodany = data.gda.weglowodany;
          console.log(this.userData);
        },
        (error) => {
          console.error("Error fetching data from Strapi:", error);
          // Handle errors
        }
      );
  }

  ngOnDestroy() {}

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

    let w = this.userData.gda.weglowodany;
    let t = this.userData.gda.tluszcze;
    let b = this.userData.gda.bialka;
    var vv = [w,t,b];

    // konstruktor do wykresu kołowego gda
    this.chartOptionsPie = {
      series: vv,
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


}
