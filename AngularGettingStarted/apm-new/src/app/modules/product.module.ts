import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared.module';

import { ConvertToSpacesPipe } from '../shared/convert-to-spaces.pipe';

import { ProductDetailGuard } from '../products/product-detail.guard';

import { ProductListComponent } from '../products/product-list.component';
import { ProductDetailComponent } from '../products/product-detail.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ConvertToSpacesPipe
  ],
  imports: [
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent },
      {
        path: 'products/:id',
        canActivate: [ ProductDetailGuard ],
        component: ProductDetailComponent }
    ]),
    SharedModule
  ]
})
export class ProductModule { }
