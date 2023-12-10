import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { IProduct } from "../interfaces/IProduct";
import { Observable, tap } from "rxjs";


@Injectable({
  providedIn: "root"
})
export class ProductHttpService {
  private _productUrl: string = "https://raw.githubusercontent.com/DeborahK/Angular-GettingStarted/master/APM-Final/src/assets/products/products.json";

  constructor(private _httpClient: HttpClient) { }

  getProducts(): Observable<IProduct[]> {
    return this._httpClient.get<IProduct[]>(this._productUrl).pipe(
      tap(data => console.log("All: ", JSON.stringify(data)))
    );
  }
}
