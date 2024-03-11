import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FetchDBdataService } from '../fetch-dbdata.service';
import { Przepis } from '../model/Przepis';
import { Skladnik } from '../model/Skladnik';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss'
})
export class EditRecipeComponent {

  przepis!: Przepis;
  id!: number;
  skladniki: Skladnik[] = [];
  formData = new FormData();
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private dbservice: FetchDBdataService){
      this.route.params.subscribe((params) => {
        this.id = params["id"];
      });


    }

    ngOnInit():void{
      this.pobierzPrzepis();
      this.pobierzSkladniki();

    }

  goBack(): void {
    this.location.back();
  }

  pobierzPrzepis() {
    this.dbservice.getRecipeWithId(this.id).subscribe((przepis) => {
      this.przepis = przepis;
      console.log(this.przepis);
    });
  }

  pobierzSkladniki() {
    this.dbservice
      .getSkladniksofRecipeWithId(this.id)
      .subscribe((skladniki) => {
        this.skladniki = skladniki;
        // console.log(this.skladniki);
      });
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.append("files", file);
      console.log(this.formData);
    }
    this.dbservice.uploadFileToDB(this.formData).subscribe((data) => {
      this.przepis.imageurl = data;
      this.imageUrl = "http://localhost:1337" + this.przepis.imageurl;
    });
  }

  submitForm() {
    //upload file
  }

}
