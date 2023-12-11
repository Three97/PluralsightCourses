import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../interfaces/IProduct';
import { ProductHttpService } from '../services/product.http.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = "Product Detail";
  product: IProduct | undefined;
  imageWidth: number = 200;
  starRating: number = 0;
  productSubscriber!: Subscription;
  showProduct: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductHttpService) { }

  onBack(): void {
    this.router.navigate(["/products"]);
  }

  displayProductDetails(): boolean {
    return this.product === undefined;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.productSubscriber = this.productService.getProducts()
      .subscribe({
        next: data => {
          this.product = data.find(x => x.productId === id);
          if (this.product) {
            this.showProduct = true;
          }
          this.starRating = Number(this.product?.starRating);
        }
      });
  }

  ngOnDestroy(): void {
    this.productSubscriber.unsubscribe();
  }
}
