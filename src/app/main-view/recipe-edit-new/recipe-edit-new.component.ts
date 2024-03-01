import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Przepis } from "../recipes/Przepis";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { FetchDBdataService } from "../fetch-dbdata.service";
import { Skladnik } from "./Skladnik";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatListModule } from "@angular/material/list";
import { FormBuilder, FormGroup, FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { Produkt } from "./Produkt";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDivider, MatDividerModule } from "@angular/material/divider";
// import { FormData } from 'formdata-node';
// import fetch, { blobFrom } from 'node-fetch';

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
[x: string]: any;

  selectedFile!: File;

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
  isViewed = true;
  isEdited = false;
  isNew = false;
  dburl: string = "http://localhost:1337";
  imageUrl: string | ArrayBuffer | null = null;
  kategorie: string[] = [];

  formData = new FormData();
  instr2: boolean = false;
  instr3: boolean = false;
  instr4: boolean = false;
  instr5: boolean = false;
  instr6: boolean = false;

  produkty:Produkt[] = [];


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dbservice: FetchDBdataService,
    private formBuilder: FormBuilder
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }

  ngOnInit(): void {
    this.pobierzSkladniki();
    this.route.url.subscribe((url) => {
      // Sprawdź, czy ostatni segment adresu URL to 'edit'
      if (url[url.length - 2].path === "edit") {
        this.isEdited = true;
        this.isViewed = false;
        this.isNew = false;
        this.pobierzPrzepis();
      }

      if (url[url.length - 1].path === "new") {
        this.isEdited = false;
        this.isViewed = false;
        this.isNew = true;
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
    });

    this.dbservice.getKategorie().subscribe((_kategorie) => {
      this.kategorie = _kategorie;
    });

    this.dbservice.getAllProdukts().subscribe((produkty:Produkt[]) => {
      console.log(produkty);
      this.produkty = produkty;
    },
    error => {
      console.log('Wystąpił błąd podczas pobierania produktów', error);
    }
    );
  }

  goBack(): void {
    this.location.back();
  }

  pobierzPrzepis() {
    this.dbservice.getRecipeWithId(this.id).subscribe((przepis) => {
      this.przepis = przepis;
      // console.log(this.przepis);
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

  touchedtextarea(tan: number) {
    console.log('dotknięto'+tan);
    switch (tan) {
      case 1:
        this.instr2 = true;
        break;
      case 2:
        this.instr3 = true;
        break;
      case 3:
        this.instr4=true;
      break
      case 4:
        this.instr5=true;
      break
      case 5:
        this.instr6=true;
      break
    };

  }

  handleBlur(event: any,val:number) {
    if (event.target.value.trim() === '') {
      // Wywołaj odpowiednią funkcję lub wykonaj odpowiednie akcje
      console.log('Pole input' + val + ' jest puste.');
      switch (val) {
        case 2:
          this.instr2 = false;
          this.przepis.instrukcja2 = '';
          this.instr3=false;
          this.przepis.instrukcja3 = '';
          this.instr4=false;
          this.przepis.instrukcja4 = '';
          this.instr5=false;
          this.przepis.instrukcja5 = '';
          this.instr6=false;
          this.przepis.instrukcja6 = '';
          break;
        case 3:
          this.instr3=false;
          this.przepis.instrukcja3 = '';
          this.instr4=false;
          this.przepis.instrukcja4 = '';
          this.instr5=false;
          this.przepis.instrukcja5 = '';
          this.instr6=false;
          this.przepis.instrukcja6 = '';
        break
        case 4:
          this.instr4=false;
          this.przepis.instrukcja4 = '';
          this.instr5=false;
          this.przepis.instrukcja5 = '';
          this.instr6=false;
          this.przepis.instrukcja6 = '';
        break
        case 5:
          this.instr5=false;
          this.przepis.instrukcja5 = '';
          this.instr6=false;
          this.przepis.instrukcja6 = '';
        break
        case 6:
          this.instr6=false;
          this.przepis.instrukcja6 = '';
        break
      }
    }
  }

  onProductSelected(event: MatSelectChange,i:number) {
    const selectedProduct = event.value;
    let temp:Produkt = this.produkty.find(({ nazwaProduktu }) => nazwaProduktu === selectedProduct)!;
    let tempskladnik:Skladnik = {
      id:temp.id,
      ilosc:0,
      nazwaProduktu:temp.nazwaProduktu,
      kcal:temp.kcal,
      tluszcze:temp.tluszcze,
      weglowodany:temp.weglowodany,
      bialko:temp.bialko,
      kcalperw:0,tluszczeperw:0,weglowodanyperw:0,bialkoperw:0
    }
    this.skladniki[i] = tempskladnik;
    console.log(this.skladniki);
    }

    addskladnik(){
      let temp:Skladnik = {
        id:0,ilosc:0,nazwaProduktu:'',kcal:0,tluszcze:0,weglowodany:0,bialko:0,
        kcalperw:0,tluszczeperw:0,weglowodanyperw:0,bialkoperw:0
      };
      this.skladniki.push(temp);
    }

    deleteskladnik(iter:number){
      this.skladniki.splice(iter,1);
    }

    makecalculations(iter:number){
      this.skladniki[iter].bialkoperw =Number((this.skladniki[iter].bialko * this.skladniki[iter].ilosc/100).toFixed(2));
      this.skladniki[iter].weglowodanyperw =Number(( this.skladniki[iter].weglowodany * this.skladniki[iter].ilosc/100).toFixed(2));
      this.skladniki[iter].tluszczeperw = Number((this.skladniki[iter].tluszcze * this.skladniki[iter].ilosc/100).toFixed(2));
      this.skladniki[iter].kcalperw = Number(( this.skladniki[iter].kcal * this.skladniki[iter].ilosc/100).toFixed(2));
    }

    onInputKeyDown(event: KeyboardEvent) {
      const keyCode = event.keyCode;

      // Sprawdź, czy wprowadzany znak nie jest cyfrą (kody klawiszy dla cyfr od 0 do 9: 48-57)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 46) {
          // Zatrzymaj propagację zdarzenia, jeśli wprowadzony znak nie jest cyfrą
          event.preventDefault();
      }
  }




}
