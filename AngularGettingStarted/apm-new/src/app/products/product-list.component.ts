import { Component, Inject, OnInit } from "@angular/core";
import { IProduct } from "./interfaces/IProduct";
import { ProductService } from "../services/product.service";

@Component({
  selector: "pm-products",
  templateUrl: "./product-list.component.html",
  styleUrls: [
    "./product-list.component.css"
  ]
})
export class ProductListComponent implements OnInit {
  constructor(private _productService: ProductService)
  {
  }

  pageTitle: string = "Product List";
  showImages: boolean = false;
  imageWidth: number = 50;
  imageMargin: number = 2;

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
    this.products = this._productService.getProducts();
    this.filteredProducts = this.products;
  }
}
