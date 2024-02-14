import { Injectable } from '@angular/core';
import { Przepis } from './recipes/Przepis';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDBdataService {
  private allrecipes:Przepis[] = [];

  private geturlrecipes = "http://localhost:1337/api/przepisy?populate=*";

  private authopts = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

   // http://localhost:1337/api/przepisy?filters[id][$eq]=5&populate=*
  //wartość żeby wyciągnąc całe dane z przepisu

  // http://localhost:1337/api/skladniks?filters[przepis][id][$eq]=5
  //ścieżka żeby znależdz składniki danego przepisu

  constructor(private http: HttpClient) {

   }

  getAllrecipes():Przepis[]{
    this.http.get(this.geturlrecipes, this.authopts).subscribe((data: any) => {
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
        this.allrecipes.push(p);
      }
      console.log(this.allrecipes);
    });
    return this.allrecipes;
  }

  deleteRecipeWithId(id:number){
    this.http
      .delete("http://localhost:1337/api/przepisy/" + id, this.authopts)
      .subscribe((response: any) => {
        console.log(response);
      });
  }

  getRecipeWithId(id: number): Observable<Przepis> {
    return new Observable(observer => {
      this.http
        .get(
          "http://localhost:1337/api/przepisy?filters[id][$eq]=" + id + "&populate=*",
          this.authopts
        )
        .subscribe((data: any) => {
          let p: Przepis = {
            id: data.data[0].id,
            nazwaPrzepisu: data.data[0].attributes.nazwaPrzepisu,
            instrukcja1: data.data[0].attributes.instrukcja1,
            instrukcja2: data.data[0].attributes.instrukcja2 ? data.data[0].attributes.instrukcja2 : "",
            instrukcja3: data.data[0].attributes.instrukcja3 ? data.data[0].attributes.instrukcja3 : "",
            instrukcja4: data.data[0].attributes.instrukcja4 ? data.data[0].attributes.instrukcja4 : "",
            instrukcja5: data.data[0].attributes.instrukcja5 ? data.data[0].attributes.instrukcja5 : "",
            instrukcja6: data.data[0].attributes.instrukcja6 ? data.data[0].attributes.instrukcja6 : "",
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
          };
          observer.next(p); // przekazujemy wartość do obserwatora
          observer.complete(); // informujemy, że operacja się zakończyła
        });
    });
  }

  getSkladniksofRecipeWithId(id:number){
    this.http.get('http://localhost:1337/api/skladniks?filters[przepis][id][$eq]=' + id + '&populate[2]=produkt.nazwaProduktu',this.authopts)
      .subscribe((data: any) =>{
        console.log(data);
        for(let i=0;i<data.length;i++){

        }
      });
  }


}
