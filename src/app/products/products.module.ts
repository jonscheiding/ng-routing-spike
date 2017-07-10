import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductService } from './product.service';
import { ProductResolverService } from './product-resolver.service';
import { ProductListResolverService } from './product-list-resolver.service';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent,
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
    ])
  ],
  providers: [ProductService, ProductListResolverService, ProductResolverService],
  declarations: [ProductListComponent, ProductEditorComponent]
})
export class ProductsModule { }
