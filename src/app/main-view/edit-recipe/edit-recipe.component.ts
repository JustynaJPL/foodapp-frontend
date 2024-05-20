import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FetchDBdataService } from '../fetch-dbdata.service';
import { Przepis } from '../model/Przepis';
import { Skladnik } from '../model/Skladnik';
import { Location } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Kategoria } from '../model/Kategoria';
import { Produkt } from '../model/Produkt';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss'
})
export class EditRecipeComponent {
  recipeForm!: FormGroup;
  przepis!: Przepis;
  id!: number;
  // skladniki: Skladnik[] = [];
  formData = new FormData();
  imageUrl: string | ArrayBuffer | null = null;
  kategorie: Kategoria[] = [];
  produkty: Produkt[] = [];
  skladnikidoBazy: Skladnik[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dbservice: FetchDBdataService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ){
      this.route.params.subscribe((params) => {
        this.id = params["id"];
      });

    }

    ngOnInit():void{
      this.pobierzPrzepis();
      if(this.przepis.imageurl) this.imageUrl = this.przepis.imageurl;
      this.pobierzSkladniki();

      this.recipeForm = this.formBuilder.group({
        nazwaPrzepisu: ['', Validators.required],
        image: ['', Validators.required], // Zakładamy, że "obraz" to będzie plik, więc początkowo null
        kategoria: this.formBuilder.group({
          id: 0,
          nazwa: ['', Validators.required],
        }),
        skladniki: this.formBuilder.array([]), // Początkowo pusta lista skladników
        instrukcje: this.formBuilder.array(
          [
            this.formBuilder.control('', Validators.required)
            // Możesz dodać więcej elementów początkowych w ten sam sposób
          ],
          { validators: this.maxArrayLength(6) }
        ),
        kcal: [0],
        bialko: [0],
        weglowodany: [0],
        tluszcze: [0],
      });

      this.dbservice.getKategorie().subscribe((_kategorie) => {
        this.kategorie = _kategorie;

        // Zakładając, że chcesz ustawić pierwszą kategorię jako wybraną
        if (_kategorie.length > 0) {
          const pierwszaKategoria = _kategorie[0];
          this.recipeForm.get("kategoria")!.patchValue({
            id: pierwszaKategoria.id,
            nazwa: pierwszaKategoria.nazwa,
          });
        }
      });

      this.dbservice.getAllProdukts().subscribe(
        (produkty: Produkt[]) => {
          this.produkty = produkty;
        },
        (error) => {
          console.log("Wystąpił błąd podczas pobierania produktów", error);
        }
      );

    }

    get skladniki() {
      return this.recipeForm.get("skladniki") as FormArray;
    }

    get instrukcje(): FormArray {
      return this.recipeForm.get("instrukcje") as FormArray;
    }

    maxArrayLength(max: number): ValidatorFn {
      return (formArray: AbstractControl): ValidationErrors | null => {
        if (formArray instanceof FormArray && formArray.length > max) {
          return { maxArrayLength: true };
        }
        return null;
      };
    }

    hasError(controlPath: string, errorType: string): boolean {
      const control = this.recipeForm.get(controlPath);
      return control
        ? control.hasError(errorType) && (control.dirty || control.touched)
        : false;
    }

    onKategoriaChange(event: MatSelectChange) {
      const wybranaKategoria = this.kategorie.find(
        (kat) => kat.nazwa === event.value
      );
      if (wybranaKategoria) {
        this.recipeForm.get("kategoria")?.patchValue({
          id: wybranaKategoria.id,
          nazwa: wybranaKategoria.nazwa,
        });
      }
      console.log(this.recipeForm.value);
    }

    onProduktChange(event: MatSelectChange, sklindex: number) {
      const wybranyProdukt = this.produkty.find(
        (kat) => kat.nazwaProduktu === event.value
      );
      if (wybranyProdukt) {
        const newSkladnik = this.formBuilder.group({
          id: wybranyProdukt?.id,
          nazwa: wybranyProdukt?.nazwaProduktu,
          ilosc: 0,
          kcal: wybranyProdukt?.kcal,
          tluszcze: wybranyProdukt?.tluszcze,
          weglowodany: wybranyProdukt?.weglowodany,
          bialko: wybranyProdukt?.bialko,
          kcalperw: 0,
          weglowodanyperw: 0,
          tluszczeperw: 0,
          bialkoperw: 0,
        });
        const skladniki = this.recipeForm.get("skladniki") as FormArray;

        // Użyj setControl, aby zastąpić kontrolkę na pozycji sklindex nową kontrolką newSkladnik
        skladniki.setControl(sklindex, newSkladnik);
      }
    }

    addSkladnik() {
      const skladniki = this.recipeForm.get("skladniki") as FormArray;
      const newSkladnik = this.formBuilder.group({
        id: 0,
        nazwa: "",
        ilosc: 0,
        kcal: 0,
        tluszcze: 0,
        weglowodany: 0,
        bialko: 0,
        kcalperw: 0,
        weglowodanyperw: 0,
        tluszczeperw: 0,
        bialkoperw: 0,
      });
      skladniki.push(newSkladnik);
      this.cdr.detectChanges();
    }

    deleteSkladnik(index: number) {
      this.skladniki.removeAt(index);
    }

    makecalculations(iter: number) {
      const skladniki = this.recipeForm.get("skladniki") as FormArray;
      const skladnik = skladniki.at(iter) as FormGroup;

      if (skladnik) {
        // Przykład obliczeń dla jednego składnika
        const ilosc = skladnik.get("ilosc")?.value || 0;
        const kcal = skladnik.get("kcal")?.value || 0;
        const bialko = skladnik.get("bialko")?.value || 0;
        const weglowodany = skladnik.get("weglowodany")?.value || 0;
        const tluszcze = skladnik.get("tluszcze")?.value || 0;

        skladnik
          .get("kcalperw")
          ?.setValue(Number(((kcal * ilosc) / 100).toFixed(0)));
        skladnik
          .get("bialkoperw")
          ?.setValue(Number(((bialko * ilosc) / 100).toFixed(2)));
        skladnik
          .get("weglowodanyperw")
          ?.setValue(Number(((weglowodany * ilosc) / 100).toFixed(2)));
        skladnik
          .get("tluszczeperw")
          ?.setValue(Number(((tluszcze * ilosc) / 100).toFixed(2)));
      }

      this.wyliczmakrodlaprzepisu();

      // Nie jest potrzebne wywoływanie detectChanges() w tym miejscu, chyba że masz specyficzne przypadki użycia.
      // this.cdr.detectChanges();
    }

    wyliczmakrodlaprzepisu() {
      const skladniki = this.recipeForm.get("skladniki") as FormArray;
      let wynik = {
        kcal: 0,
        weglowodany: 0,
        tluszcze: 0,
        bialko: 0,
      };
      for (let i = 0; i < skladniki.length; i++) {
        wynik.kcal = wynik.kcal + skladniki.at(i).get("kcalperw")?.value;
        wynik.weglowodany =
          wynik.weglowodany + skladniki.at(i).get("weglowodanyperw")?.value;
        wynik.tluszcze =
          wynik.tluszcze + skladniki.at(i).get("tluszczeperw")?.value;
        wynik.bialko = wynik.bialko + skladniki.at(i).get("bialkoperw")?.value;
      }
      this.recipeForm.get("kcal")?.setValue(wynik.kcal);
      this.recipeForm.get("weglowodany")?.setValue(wynik.weglowodany);
      this.recipeForm.get("bialko")?.setValue(wynik.bialko);
      this.recipeForm.get("tluszcze")?.setValue(wynik.tluszcze);
    }

    onInputKeyDown(event: KeyboardEvent) {
      const allowedKeys = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "NumPad0",
        "NumPad1",
        "NumPad2",
        "NumPad3",
        "NumPad4",
        "NumPad5",
        "NumPad6",
        "NumPad7",
        "NumPad8",
        "NumPad9",
        "ArrowLeft",
        "ArrowRight",
        "Backspace",
        "Delete",
        "Enter",
      ];

      if (!allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
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
    const skladniki = this.recipeForm.get("skladniki") as FormArray;
    this.dbservice
      .getSkladniksofRecipeWithId(this.id)
      .subscribe((skladnikizbazy) => {
        skladnikizbazy.forEach(skl => {
          skladniki.push(skl);
        });
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

  checkFields(index: number): void {
    const instrukcje = this.recipeForm.get("instrukcje") as FormArray;

    const currentControl = instrukcje.at(index);
    if (!currentControl.value && instrukcje.length > 1) {
      // Jeśli obecne pole jest puste i jest więcej niż jedno pole, usuń obecne pole
      instrukcje.removeAt(index);
    } else if (
      index === instrukcje.length - 1 &&
      currentControl.value &&
      instrukcje.length < 6
    ) {
      // Jeśli obecne pole jest ostatnie i nie jest puste, i jest mniej niż 6 pól, dodaj nowe pole
      instrukcje.push(this.formBuilder.control("", Validators.required));
    }
  }

  submitForm() {
    //upload file
  }

}
