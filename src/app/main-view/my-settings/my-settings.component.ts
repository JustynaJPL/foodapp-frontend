import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule, NgIfContext } from "@angular/common";
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
import { Observable, catchError, delay, last, map, of, take } from "rxjs";
import { param } from "jquery";
import qs from "qs";
import { FormsModule } from "@angular/forms";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";

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
  gda: GDA;
}

interface GDA {
  bialka: number;
  kcal: number;
  tluszcze: number;
  weglowodany: number;
}

interface Pomiar {
  wartosc: number;
  dataodczytu: Date;
  iduser: number;
}

const puturl =
  "http://localhost:1337/api/users/" + localStorage.getItem("userId");

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
    FormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: "./my-settings.component.html",
  styleUrl: "./my-settings.component.scss",
  providers: [],
})

// TODO:dodac dane z backendu do danych i do wykresów
export class MySettingsComponent implements OnInit {
  // konstruktor do wykresu kołowego gda

  // @ViewChild("chart")
  // chart!: ChartComponent;
  // public chartOptions!: Partial<ChartOptions>;

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
    gda: {
      bialka: 0,
      kcal: 0,
      tluszcze: 0,
      weglowodany: 0,
    },
  };

  pomiary: Pomiar[] = [];
  nowypomiarwagi: Pomiar = {
    dataodczytu: new Date(),
    wartosc: 0,
    iduser: 0,
  };

  private url = "http://localhost:1337/api/users/";
  private urlwaga = "http://localhost:1337/api/wagas/";
  private opts = {
    params: { populate: "*" },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  bmi!: number;
  wartoscipomiarow!: number[];
  nameediting: boolean = false;
  nameedit: boolean = false;
  genedit: boolean = false;

  private putopts = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };


  constructor(private http: HttpClient) {
    this.getDataFromStrapi();
    this.setinitialDataForCharts();
  }

  ngOnInit(): void {}

  getDataFromStrapi() {
    this.http
      .get(this.url + localStorage.getItem("userId"), this.opts)
      .subscribe(
        (data: any) => {
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
        },
        (error) => {
          console.error("Error fetching data from Strapi:", error);
          // Handle errors
        }
      );

    this.http.get(this.urlwaga, this.opts).subscribe(
      (data: any) => {
        // console.log("Data from Strapi:", data.data[0]);
        for (let i = 0; i < data.data.length; i++) {
          let p: Pomiar = {
            dataodczytu: data.data[i].attributes.dataodczytu,
            wartosc: data.data[i].attributes.wartosc,
            iduser: data.data[i].attributes.users_permissions_user.data.id,
          };
          // console.log(p);
          if (p.iduser.toFixed(0) == localStorage.getItem("userId")) {
            this.pomiary.push(p);
          }
        }
        // console.log("pomiary: ", this.pomiary);
      },
      (error) => {
        console.error("Error fetching data from Strapi:", error);
        // Handle errors
      }
    );

    console.log(this.pomiary);
  }

  ngOnDestroy() {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error;
    return of();
  }

  private setinitialDataForCharts() {
    // konstruktor do wykresu kołowego gda
    this.chartOptionsPie = {
      series: [10, 10, 10],
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

  getBMI(): number {
    this.pomiary.sort((a: any, b: any) => {
      return Date.parse(a.dataodczytu) - Date.parse(b.dataodczytu);
    });

    this.bmi =
      this.pomiary.slice(-1)[0].wartosc /
      (((this.userData.height / 100) * this.userData.height) / 100);
    return this.bmi;
  }
  getAge(): number {
    var age = 0;
    if (this.userData.birth) {
      const today = new Date();
      const birth = new Date(this.userData.birth);
      const diff = today.getFullYear() - birth.getFullYear();

      // Check if the birthday has occurred this year
      if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
          today.getDate() < birth.getDate())
      ) {
        age = diff - 1;
      } else {
        age = diff;
      }
    }
    return age;
  }

  getprogressvalue(): number {
    let val = this.getBMI();
    return (val / 50) * 100;
  }

  getObese(): string {
    if (this.getBMI() < 16) return "III stopień szczupłości";
    if (this.getBMI() > 16 && this.getBMI() <= 16.9)
      return "II stopień szczupłości";
    if (this.getBMI() > 16.9 && this.getBMI() <= 18.4)
      return "I stopień szczupłości";
    if (this.getBMI() > 18.4 && this.getBMI() <= 24.9) return "Norma";
    if (this.getBMI() > 24.9 && this.getBMI() <= 29.9) return "Nadwaga";
    if (this.getBMI() > 29.9 && this.getBMI() <= 34.9)
      return "I stopień otyłości";
    if (this.getBMI() > 34.9 && this.getBMI() <= 39.9)
      return "II stopień otyłości";
    if (this.getBMI() > 39.9) return "III stopień otyłości";
    else {
      return "Błąd";
    }
  }
  stopusernameEditing() {
    this.nameediting = false;
    // this.editedValue = this.labelValue;
  }
  startusernameEditing() {
    this.nameediting = true;
  }
  changeusername() {
    this.nameediting = false;

    this.http
      .put(puturl, { username: this.userData.username }, this.putopts)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  stopnameEditing() {
    this.nameedit = false;
  }

  startnameediting() {
    this.nameedit = true;
  }
  changename() {
    this.nameedit = false;

    this.http
      .put(puturl, { name: this.userData.name }, this.putopts)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  stopgenediting() {
    this.genedit = false;
  }

  startgenediting() {
    this.genedit = true;
  }
  changegender() {
    this.genedit = false;

    this.http
      .put(puturl, { gender: this.userData.gender }, this.putopts)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  heightedit: boolean = false;

  stopheightediting() {
    this.heightedit = false;
  }

  startheightediting() {
    this.heightedit = true;
  }
  changeheight() {
    this.heightedit = false;

    this.http
      .put(
        "http://localhost:1337/api/wagas/",
        { dataodczytu: this.userData.height },
        this.putopts
      )
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  birthedit: boolean = false;

  stopbirthediting() {
    this.birthedit = false;
  }

  startbirthediting() {
    this.birthedit = true;
  }
  changebirth() {
    this.birthedit = false;

    this.http
      .put(puturl, { birth: this.userData.birth }, this.putopts)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  sportedit: boolean = false;

  stopsportediting() {
    this.sportedit = false;
  }

  startsportediting() {
    this.sportedit = true;
  }
  changesport() {
    this.sportedit = false;

    this.http
      .put(puturl, { sport: this.userData.sport }, this.putopts)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  addwaga: boolean = false;

  stopwagaediting() {
    this.addwaga = false;
  }

  startwagaediting() {
    this.addwaga = true;
  }
  newwaga() {
    this.addwaga = false;
    let val = Number.parseInt(localStorage.getItem("userId")!);
    this.nowypomiarwagi.iduser = val;

    this.http
      .post(
        "http://localhost:1337/api/wagas/",
        {
          data: {
            dataodczytu: this.nowypomiarwagi.dataodczytu,
            wartosc: this.nowypomiarwagi.wartosc,
            users_permissions_user:{
              id:val
            }
          },
        },
        this.putopts
      )
      .subscribe((data: any) => {
        console.log(data);
      });
      delay(1000);
      window.location.reload();
  }

  editgda:boolean = false;

  stopgdaediting() {
    this.editgda = false;
  }

  startgdaediting() {
    this.editgda = true;
  }

  gdaerror:boolean = false;

  newgda() {

    if(this.userData.gda.bialka + this.userData.gda.tluszcze + this.userData.gda.weglowodany == 100){

    this.http
      .put(puturl,
        {
          gda:{
            kcal:this.userData.gda.kcal,
            bialka:this.userData.gda.bialka,
            tluszcze: this.userData.gda.tluszcze,
            weglowodany:this.userData.gda.weglowodany
          }
        },
        this.putopts
      )
      .subscribe((data: any) => {
        console.log(data);
      });
      this.editgda = false;
      this.gdaerror = false;
    }
    else{
      this.gdaerror = true;
    }

  }

}
