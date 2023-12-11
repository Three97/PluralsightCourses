import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../interfaces/IProduct';
import { ProductService } from '../services/product.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = "Product Detail";
  product: IProduct | undefined;
  imageWidth: number = 200;
  starRating: number = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService) { }

  onBack(): void {
    this.router.navigate(["/products"]);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.product = this.productService.getProducts().find(x => x.productId === id);
    this.starRating = Number(this.product?.starRating);
  }
}
