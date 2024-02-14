import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { HttpClient } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatListModule } from "@angular/material/list";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  Router,
  RouterModule,
} from "@angular/router";
import { Przepis } from "./Przepis";
import { FetchDBdataService } from "../fetch-dbdata.service";

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
    FlexLayoutModule,
    RouterModule,
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

  przepisy: Przepis[] = [];

  displayedColumns: string[] = [
    "nazwa",
    "kategoria",
    "kcal",
    "bialko",
    "tluszcze",
    "weglowodany",
    "actions",
  ];

  constructor(private dataservice: FetchDBdataService) {

    this.dataSource = new MatTableDataSource<Przepis>();
    this.przepisy = dataservice.getAllrecipes();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.przepisy;
  }

  deleteRecipe(id: number) {
    this.dataservice.deleteRecipeWithId(id);
  }

  editRecipe() {}

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
