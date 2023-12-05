import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { IProduct } from "./interfaces/IProduct";
import { ProductHttpService } from "../services/product.http.service";
import { Subscription } from "rxjs";

@Component({
  selector: "pm-products",
  templateUrl: "./product-list.component.html",
  styleUrls: [
    "./product-list.component.css"
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  constructor(private _productService: ProductHttpService)
  {
  }

  pageTitle: string = "Product List";
  showImages: boolean = false;
  imageWidth: number = 50;
  imageMargin: number = 2;
  productSubscriber!: Subscription;

  private _listFilter: string = "";
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.performFilter(value);
  }

  filteredProducts: IProduct[] = [];
  products: Array<IProduct> = [];
  toggleImage(): void {
    this.showImages = !this.showImages;
  }

  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().includes(filterBy));
  }

  onRatingClicked(message: string): void {
    console.log(message);
    this.pageTitle = message;
  }

  ngOnInit(): void {
    this.listFilter = "";
    this.productSubscriber = this._productService
      .getProducts().subscribe({
        next: data => {
          this.products = data;
          this.filteredProducts = this.products;
        },
        error: err => console.log(err)
      });
  }

  ngOnDestroy(): void {
    this.productSubscriber.unsubscribe();
  }
}
