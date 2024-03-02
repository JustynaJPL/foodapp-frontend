import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Przepis } from "../recipes/Przepis";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { FetchDBdataService } from "../fetch-dbdata.service";
import { Skladnik } from "./Skladnik";
import { MatTableModule } from "@angular/material/table";
import { MatListModule } from "@angular/material/list";
import { FormBuilder, FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Produkt } from "./Produkt";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: "app-recipe-edit-new",
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatTableModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatDividerModule
  ],
  templateUrl: "./recipe-edit-new.component.html",
  styleUrl: "./recipe-edit-new.component.scss",
})
export class RecipeEditNewComponent {
  przepis!: Przepis;
  id!: number;
  skladniki: Skladnik[] = [];
  displayedColumns: string[] = [
    "nazwa",
    "ilosc",
    "kcal",
    "tluszcze",
    "weglowodany",
    "bialko",
    "kcalperw",
    "tluszczeperw",
    "weglowodanyperw",
    "bialkoperw",
  ];

  // imageUrl: string | ArrayBuffer | null = null;
  dburl: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dbservice: FetchDBdataService) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
    this.dburl = dbservice.dburl;


    this.przepis = {
      id: 0,
      nazwaPrzepisu: "",
      instrukcja1: "",
      kategoria1: {
        data: {
          attributes: {
            nazwakategori: "",
          },
        },
      },
      gda: {
        kcal: 0,
        bialka: 0,
        tluszcze: 0,
        weglowodany: 0,
      },
    };

  }

  ngOnInit(): void {
    this.pobierzSkladniki();
    this.pobierzPrzepis();
  }

  goBack(): void {
    this.location.back();
  }



  pobierzSkladniki() {
    this.dbservice
      .getSkladniksofRecipeWithId(this.id)
      .subscribe((skladniki) => {
        this.skladniki = skladniki;
        // console.log(this.skladniki);
      });
  }

  pobierzPrzepis() {
    this.dbservice.getRecipeWithId(this.id).subscribe((przepis) => {
      this.przepis = przepis;
      console.log(this.przepis);
    });
  }

  submitForm() {
    //upload file
  }
}
