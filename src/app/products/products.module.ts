import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { NullComponent } from '../shared/null.component';

import { ProductList } from './product-list';
import { CurrentProduct } from './current-product';
import { ProductService } from './product.service';
import { ProductResolverService } from './product-resolver.service';
import { ProductListResolverService } from './product-list-resolver.service';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { RedirectToFirstCategoryGuard } from './redirect-to-first-category.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'products', children: [
        { path: '', canActivate: [RedirectToFirstCategoryGuard], component: NullComponent },
        { path: ':category', component: ProductListComponent,
          resolve: {
            products: ProductListResolverService
          },
          children: [
            { path: ':productId', component: ProductEditorComponent,
              resolve: {
                product: ProductResolverService
              }
            }
          ]
        }
      ]}
    ])
  ],
  providers: [
    ProductService,
    ProductListResolverService,
    ProductResolverService,
    ProductList,
    CurrentProduct,
    RedirectToFirstCategoryGuard
  ],
  declarations: [ProductListComponent, ProductEditorComponent]
})
export class ProductsModule { }
