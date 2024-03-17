import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { Przepis } from "../model/Przepis";
import { Skladnik } from "../model/Skladnik";
import { Produkt } from "../model/Produkt";
import { ActivatedRoute } from "@angular/router";
import { FetchDBdataService } from "../fetch-dbdata.service";
import { Location } from "@angular/common";
import { Kategoria } from "../model/Kategoria";
import { switchMap } from "rxjs";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: "app-create-new-recipe",
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
    ReactiveFormsModule
  ],
  templateUrl: "./create-new-recipe.component.html",
  styleUrl: "./create-new-recipe.component.scss",
})
export class CreateNewRecipeComponent {


  selectedFile!: File;
  przepis!: Przepis;
  skladniki: Skladnik[] = [];
  dburl: string = "http://localhost:1337";
  imageUrl: string | ArrayBuffer | null = null;
  kategorie: Kategoria[]=[];
  formData = new FormData();
  instr2: boolean = false;
  instr3: boolean = false;
  instr4: boolean = false;
  instr5: boolean = false;
  instr6: boolean = false;
  produkty: Produkt[] = [];
  formGroup: any;
  notchoosenimage:boolean = false;
  choosenimage:boolean = false;
  noskaldniks: boolean = false;
  errorany: boolean = false;
  nokategoria: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dbservice: FetchDBdataService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.przepis = {
      id: 0,
      nazwaPrzepisu: "",
      instrukcja1: "",
      kategoria1: {
        data: {
          attributes: {
            id:0,
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

    this.formGroup = this.formBuilder.group({
      nazwaPrzepisu: ['', Validators.required], // Dodaj walidatory, jeśli potrzebujesz
      image:['', Validators.required],
      kategoria:['',Validators.required],
      produkty:['',Validators.required],
      iloscskladnika:['', Validators.compose([Validators.required, Validators.min(0),Validators.pattern('0-9')])],
      instrukcja1:['',Validators.required]
    });
  }

  hasError(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  ngOnInit(): void {
    this.dbservice.getKategorie().subscribe((_kategorie) => {
      this.kategorie = _kategorie;
      console.log(_kategorie);
    });

    this.dbservice.getAllProdukts().subscribe(
      (produkty: Produkt[]) => {
        // console.log(produkty);
        this.produkty = produkty;
      },
      (error) => {
        console.log("Wystąpił błąd podczas pobierania produktów", error);
      }
    );
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.set("files", file);
      // console.log(this.formData);
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.choosenimage = true;
      };
      this.choosenimage = true;
      reader.readAsDataURL(file);
      if(this.notchoosenimage==true) this.notchoosenimage=false;

    }
    else{
      this.notchoosenimage = true;
    }
  }

  touchedtextarea(tan: number) {
    // console.log("dotknięto" + tan);
    switch (tan) {
      case 1:
        this.instr2 = true;
        break;
      case 2:
        this.instr3 = true;
        break;
      case 3:
        this.instr4 = true;
        break;
      case 4:
        this.instr5 = true;
        break;
      case 5:
        this.instr6 = true;
        break;
    }
  }

  handleBlur(event: any, val: number) {
    if (event.target.value.trim() === "") {
      // Wywołaj odpowiednią funkcję lub wykonaj odpowiednie akcje
      // console.log("Pole input" + val + " jest puste.");
      switch (val) {
        case 2:
          this.instr2 = false;
          this.przepis.instrukcja2 = "";
          this.instr3 = false;
          this.przepis.instrukcja3 = "";
          this.instr4 = false;
          this.przepis.instrukcja4 = "";
          this.instr5 = false;
          this.przepis.instrukcja5 = "";
          this.instr6 = false;
          this.przepis.instrukcja6 = "";
          break;
        case 3:
          this.instr3 = false;
          this.przepis.instrukcja3 = "";
          this.instr4 = false;
          this.przepis.instrukcja4 = "";
          this.instr5 = false;
          this.przepis.instrukcja5 = "";
          this.instr6 = false;
          this.przepis.instrukcja6 = "";
          break;
        case 4:
          this.instr4 = false;
          this.przepis.instrukcja4 = "";
          this.instr5 = false;
          this.przepis.instrukcja5 = "";
          this.instr6 = false;
          this.przepis.instrukcja6 = "";
          break;
        case 5:
          this.instr5 = false;
          this.przepis.instrukcja5 = "";
          this.instr6 = false;
          this.przepis.instrukcja6 = "";
          break;
        case 6:
          this.instr6 = false;
          this.przepis.instrukcja6 = "";
          break;
      }
    }
  }

  onProductSelected(event: MatSelectChange, i: number) {
    const selectedProduct = event.value;
    let temp: Produkt = this.produkty.find(
      ({ nazwaProduktu }) => nazwaProduktu === selectedProduct
    )!;
    let tempskladnik: Skladnik = {
      id: temp.id,
      ilosc: 0,
      nazwaProduktu: temp.nazwaProduktu,
      kcal: temp.kcal,
      tluszcze: temp.tluszcze,
      weglowodany: temp.weglowodany,
      bialko: temp.bialko,
      kcalperw: 0,
      tluszczeperw: 0,
      weglowodanyperw: 0,
      bialkoperw: 0,
    };
    this.skladniki[i] = tempskladnik;
    console.log(this.skladniki);
  }

  addskladnik() {
    let temp: Skladnik = {
      id: 0,
      ilosc: 0,
      nazwaProduktu: "",
      kcal: 0,
      tluszcze: 0,
      weglowodany: 0,
      bialko: 0,
      kcalperw: 0,
      tluszczeperw: 0,
      weglowodanyperw: 0,
      bialkoperw: 0,
    };
    this.skladniki.push(temp);
    this.noskaldniks = false;
  }

  deleteskladnik(iter: number) {
    this.skladniki.splice(iter, 1);
  }

  makecalculations(iter: number) {
    this.skladniki[iter].bialkoperw = Number(
      (
        (this.skladniki[iter].bialko * this.skladniki[iter].ilosc) /
        100
      ).toFixed(2)
    );
    this.skladniki[iter].weglowodanyperw = Number(
      (
        (this.skladniki[iter].weglowodany * this.skladniki[iter].ilosc) /
        100
      ).toFixed(2)
    );
    this.skladniki[iter].tluszczeperw = Number(
      (
        (this.skladniki[iter].tluszcze * this.skladniki[iter].ilosc) /
        100
      ).toFixed(2)
    );
    this.skladniki[iter].kcalperw = Number(
      ((this.skladniki[iter].kcal * this.skladniki[iter].ilosc) / 100).toFixed(
        0
      )
    );
  }

  onInputKeyDown(event: KeyboardEvent) {
    const keyCode = event.keyCode;

    // Sprawdź, czy wprowadzany znak nie jest cyfrą (kody klawiszy dla cyfr od 0 do 9: 48-57)
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 46) {
      // Zatrzymaj propagację zdarzenia, jeśli wprowadzony znak nie jest cyfrą
      event.preventDefault();
    }
  }

  private przepisid:number=0;

  submitForm() {
    if (!this.choosenimage) this.notchoosenimage = true;
    if (this.skladniki.length == 0) this.noskaldniks = true;
    if (this.przepis.kategoria1.data.attributes.nazwakategori == "") this.nokategoria = true;
    if(this.notchoosenimage==true || this.noskaldniks == true || this.nokategoria == true) {}
    else {
      console.log("Brak błędów " + this.przepis);

      this.wyliczmakrodlaprzepisu();
      // console.log(this.przepis);

      this.dbservice.uploadFileToDB(this.formData).pipe(
        switchMap(data => {
          this.przepis.imageId = data[0].id;
          return this.dbservice.addRecipetoDB(this.przepis, this.przepis.imageId!);
        }),
        switchMap(resp => {
          this.przepisid = resp.data.id;
          return this.dbservice.uploadImagetoRecipeWithNumber(this.przepisid, this.przepis.imageId!);
        }),
        switchMap(finalResp => {
          // Tutaj dodajemy składniki do przepisu, używając przepisid jako ID przepisu
          return this.dbservice.createSkladniksofRecipe(this.skladniki, this.przepisid);
        })
      ).subscribe({
        next: (finalResp) => {
          console.log(finalResp);
          console.log(this.przepis);
          this.submitedMessage("Przepis został dodany do bazy!")
          // Możesz dodać tutaj dodatkową logikę po pomyślnym dodaniu wszystkich elementów
        },
        error: (error) => {
          console.error('Wystąpił błąd podczas przetwarzania formularza', error);
        }
      });
      this.goBack();
    }
}


  onKategoriaSelected(nazwa:string) {
    console.log(nazwa);
    this.nokategoria = false;
    let kateg = this.kategorie.find(k =>k.nazwa === nazwa);
    this.przepis.kategoria1.data.attributes.id = kateg?.id!;
    this.przepis.kategoria1.data.attributes.nazwakategori = kateg?.nazwa!;

    // console.log('dana w przepis =' + this.przepis.kategoria1.data.attributes.id );

    }

  goBack(): void {
    this.location.back();
  }

  wyliczmakrodlaprzepisu(){
    this.przepis.gda.kcal = this.wyliczmakrodlaprzepisukcal();
    this.przepis.gda.bialka = this.wyliczmakrodlaprzepisubialko();
    this.przepis.gda.weglowodany = this.wyliczmakrodlaprzepisuweglowodany();
    this.przepis.gda.tluszcze = this.wyliczmakrodlaprzepisutluszcze();
  }

  wyliczmakrodlaprzepisukcal():number {
    if(this.skladniki.length ==0) return 0;
    else{
      let wynik:number = 0;
      for (let i = 0; i < this.skladniki.length; i++) {
        wynik = wynik + this.skladniki[i].kcalperw!;
      }
      return wynik;
    }
  }

  wyliczmakrodlaprzepisutluszcze():number{
    if(this.skladniki.length ==0) return 0;
    else{
      let wynik:number = 0;
      for (let i = 0; i < this.skladniki.length; i++) {
        wynik = wynik + this.skladniki[i].tluszczeperw!;
      }
      return wynik;
    }

  }

  wyliczmakrodlaprzepisubialko(): number {
    if(this.skladniki.length ==0) return 0;
    else{
      let wynik:number = 0;
      for (let i = 0; i < this.skladniki.length; i++) {
        wynik = wynik + this.skladniki[i].bialkoperw!;
      }
      return wynik;
    }

    }
    wyliczmakrodlaprzepisuweglowodany(): number {
      if(this.skladniki.length ==0) return 0;
    else{
      let wynik:number = 0;
      for (let i = 0; i < this.skladniki.length; i++) {
        wynik = wynik + this.skladniki[i].weglowodanyperw!;
      }
      return wynik;
    }

    }

    submitedMessage(message: string) {
      this._snackBar.open(message,"ok!");
    }
}




