import { Injectable } from '@angular/core';
import { Przepis } from './recipes/Przepis';
import { HttpClient} from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Skladnik } from './recipe-edit-new/Skladnik';
import { Produkt } from './recipe-edit-new/Produkt';
import { response } from 'express';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class FetchDBdataService {
  private allrecipes:Przepis[] = [];


  private geturlrecipes = "http://localhost:1337/api/przepisy?populate=*";
  private geturlprodukts = "http://localhost:1337/api/produkts?populate=*"

  private authopts = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`},
  };

  private authoptsupload = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
   'Content-Type': 'multipart/form-data'
  };


  private getkategoriesurl:string = "http://localhost:1337/api/kategories";
  private DBuploadURL: string = 'http://localhost:1337/api/upload';

   // http://localhost:1337/api/przepisy?filters[id][$eq]=5&populate=*
  //wartość żeby wyciągnąc całe dane z przepisu

  // http://localhost:1337/api/skladniks?filters[przepis][id][$eq]=5
  //ścieżka żeby znależdz składniki danego przepisu

  constructor(private http: HttpClient) {

   }

   getAllrecipes(): Observable<Przepis[]> {
    return this.http.get(this.geturlrecipes, this.authopts).pipe(
      map((data: any) => {
        let recipes: Przepis[] = [];
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
            }
          };
          recipes.push(p);
        }
        return recipes;
      })
    );
  }

  deleteRecipeWithId(id: number): Observable<any> {
    return this.http.delete("http://localhost:1337/api/przepisy/" + id, this.authopts);
  }

  getRecipeWithId(id: number): Observable<Przepis> {
    return new Observable(observer => {
      this.http
        .get(
          "http://localhost:1337/api/przepisy?filters[id][$eq]=" + id + "&populate=*",
          this.authopts
        )
        .subscribe((data: any) => {
          console.log(data);
          let p: Przepis = {
            id: data.data[0].id,
            nazwaPrzepisu: data.data[0].attributes.nazwaPrzepisu,
            instrukcja1: data.data[0].attributes.instrukcja1,
            instrukcja2: data.data[0].attributes.instrukcja2 ? data.data[0].attributes.instrukcja2 : undefined,
            instrukcja3: data.data[0].attributes.instrukcja3 ? data.data[0].attributes.instrukcja3 : undefined,
            instrukcja4: data.data[0].attributes.instrukcja4 ? data.data[0].attributes.instrukcja4 : undefined,
            instrukcja5: data.data[0].attributes.instrukcja5 ? data.data[0].attributes.instrukcja5 : undefined,
            instrukcja6: data.data[0].attributes.instrukcja6 ? data.data[0].attributes.instrukcja6 : undefined,
            kategoria1: {
              data: {
                attributes: {
                  nazwakategori: data.data[0].attributes.kategoria1.data.attributes.nazwakategori,
                },
              },
            },
            gda: {
              kcal: data.data[0].attributes.gda.kcal,
              bialka: data.data[0].attributes.gda.bialka,
              tluszcze: data.data[0].attributes.gda.tluszcze,
              weglowodany: data.data[0].attributes.gda.weglowodany,
            },
            imageurl: data.data[0].attributes.przepisimg.data.attributes.url
          };
          observer.next(p); // przekazujemy wartość do obserwatora
          observer.complete(); // informujemy, że operacja się zakończyła
        });
    });
  }

  getSkladniksofRecipeWithId(id: number): Observable<Skladnik[]> {
    return this.http.get('http://localhost:1337/api/skladniks?filters[przepis][id][$eq]=' + id + '&populate[2]=produkt.nazwaProduktu', this.authopts)
      .pipe(
        map((response: any) => {
          let skladniki: Skladnik[] = [];
          for(let item of response.data) {
            let skladnik: Skladnik = {
              id: item.id,
              ilosc: item.attributes.ilosc,
              nazwaProduktu: item.attributes.produkt.data.attributes.nazwaProduktu,
              kcal: item.attributes.produkt.data.attributes.kcal,
              tluszcze: item.attributes.produkt.data.attributes.tluszcze,
              weglowodany: item.attributes.produkt.data.attributes.weglowodany,
              bialko: item.attributes.produkt.data.attributes.bialko,
              kcalperw : item.attributes.produkt.data.attributes.kcal * item.attributes.ilosc / 100,
              tluszczeperw : item.attributes.produkt.data.attributes.tluszcze * item.attributes.ilosc / 100,
              weglowodanyperw :item.attributes.produkt.data.attributes.weglowodany * item.attributes.ilosc / 100,
              bialkoperw : item.attributes.produkt.data.attributes.bialko * item.attributes.ilosc / 100
            };
            skladniki.push(skladnik);
          }


          return skladniki;
        })
      );
  }

  policzMakroSkladnikow(){

  }

  getAllProdukts(): Observable<Produkt[]> {
    return this.http.get(this.geturlprodukts, this.authopts).pipe(
      map((data: any) => {
        let produkty: Produkt[] = [];
        for (let i = 0; i < data.data.length; i++) {
          let p: Produkt = {
            id: data.data[i].id,
            nazwaProduktu:data.data[i].attributes.nazwaProduktu,
            kcal:data.data[i].attributes.kcal,
            tluszcze:data.data[i].attributes.tluszcze,
            weglowodany:data.data[i].attributes.weglowodany,
            bialko:data.data[i].attributes.bialko
          };
          produkty.push(p);
        }
        return produkty;
      })
    );
  }

  getKategorie():Observable<string[]>{
    return this.http.get(this.getkategoriesurl, this.authopts).pipe(
      map((data:any) => {
        let kategorie:string[] = [];
        for (let i = 0; i < data.data.length; i++) {
          kategorie.push(data.data[i].attributes.nazwakategori);
          // console.log(kategorie);
        }
        return kategorie;
      }

      )
    )
  }

  uploadFileToDB(formData: FormData):Observable<string>{
    return this.http.post(this.DBuploadURL,formData, this.authopts)
      .pipe(
        map((response: any) => {
          console.log('Plik został pomyślnie przesłany na serwer Strapi.', response);
          return response[0].url;
        }),
        catchError(error => {
          console.error('Wystąpił błąd podczas wysyłania pliku na serwer Strapi.', error);
          throw error;
        })
      );
  }




}
