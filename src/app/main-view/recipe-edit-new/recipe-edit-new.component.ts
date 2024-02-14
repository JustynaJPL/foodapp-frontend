import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Przepis } from "../recipes/Przepis";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { FetchDBdataService } from "../fetch-dbdata.service";

@Component({
  selector: "app-recipe-edit-new",
  standalone: true,
  imports: [CommonModule, MatGridListModule],
  templateUrl: "./recipe-edit-new.component.html",
  styleUrl: "./recipe-edit-new.component.scss",
})
export class RecipeEditNewComponent {
  przepis!: Przepis;
  id!: number;

  constructor(private route: ActivatedRoute, private location: Location, private dbservice: FetchDBdataService) {
    this.route.params.subscribe((params) => { this.id = params["id"]; });

  }

  ngOnInit(): void {
    this.pobierzPrzepis();
  }

  goBack(): void {
    this.location.back();
  }

  pobierzPrzepis() {
    this.dbservice.getRecipeWithId(this.id).subscribe(przepis => {
      this.przepis = przepis;
    });
  }
}
