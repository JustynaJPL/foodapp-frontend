import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { HttpClient } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatListModule } from "@angular/material/list";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { delay } from "rxjs";

export interface Przepis {
  id: number;
  nazwaPrzepisu: string;
  instrukcja1: string;
  instrukcja2?: string;
  instrukcja3?: string;
  instrukcja4?: string;
  instrukcja5?: string;
  instrukcja6?: string;
  kategoria1: {
    data: {
      attributes: {
        nazwakategori: string;
      };
    };
  };
  gda: {
    kcal: number;
    bialka: number;
    tluszcze: number;
    weglowodany: number;
  };
}

@Component({
  selector: "app-recipes",
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatListModule,
    MatFormFieldModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
  ],
  templateUrl: "./recipes.component.html",
  styleUrl: "./recipes.component.scss",
})
export class RecipesComponent {
  dataSource: MatTableDataSource<Przepis>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  private geturlrecipes = "http://localhost:1337/api/przepisy?populate=*";

  private authopts = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  przepisy: Przepis[] = [];

  displayedColumns: string[] = [
    "nazwa",
    "kategoria",
    "kcal",
    "bialko",
    "tluszcze",
    "weglowodany",
    "actions"
  ];

  constructor(private http: HttpClient) {
    http.get(this.geturlrecipes, this.authopts).subscribe((data: any) => {
      console.log(data);
      // console.log(data.data.length);

      for (let i = 0; i < data.data.length; i++) {
        let p: Przepis = {
          id: data.data[i].id,
          nazwaPrzepisu: data.data[i].attributes.nazwaPrzepisu,
          instrukcja1: data.data[i].attributes.instrukcja1,
          instrukcja2: data.data[i].attributes.instrukcja2
            ? data.data[i].attributes.instrukcja2
            : "",
          instrukcja3: data.data[i].attributes.instrukcja3
            ? data.data[i].attributes.instrukcja3
            : "",
          instrukcja4: data.data[i].attributes.instrukcja4
            ? data.data[i].attributes.instrukcja4
            : "",
          instrukcja5: data.data[i].attributes.instrukcja5
            ? data.data[i].attributes.instrukcja5
            : "",
          instrukcja6: data.data[i].attributes.instrukcja6
            ? data.data[i].attributes.instrukcja6
            : "",
          kategoria1: {
            data: {
              attributes: {
                nazwakategori:
                  data.data[i].attributes.kategoria1.data.attributes
                    .nazwakategori,
              },
            },
          },
          gda: {
            kcal: data.data[i].attributes.gda.kcal,
            bialka: data.data[i].attributes.gda.bialka,
            tluszcze: data.data[i].attributes.gda.tluszcze,
            weglowodany: data.data[i].attributes.gda.weglowodany,
          },
        };
        console.log(p);
        this.przepisy.push(p);
      }
      console.log(this.przepisy);
    });

    this.dataSource = new MatTableDataSource<Przepis>();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.przepisy;
  }

  deleteRecipe(id: number) {
    // console.log("http://localhost:1337/api/przepisy/" + id + this.authopts);
    this.http
      .delete("http://localhost:1337/api/przepisy/" + id, this.authopts)
      .subscribe((response: any) => {
        console.log(response);
      });

  }

  editRecipe() {}

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  checkRecipe(){

  }
}
