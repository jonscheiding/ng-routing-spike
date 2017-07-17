import { ROUTE_DATA_BREADCRUMB } from './../breadcrumb.service';
import { RouteResolverRefreshService } from './../route-resolver-refresh.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRouteSnapshot } from '@angular/router';

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
        data: {
          [ROUTE_DATA_BREADCRUMB]: 'Products'
        },
        resolve: {
          products: ProductListResolverService
        },
        children: [
          { path: ':productId', component: ProductEditorComponent,
            data: {
              [ROUTE_DATA_BREADCRUMB]: route => route.data['product'].productName
            },
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
export class ProductsModule {
  constructor(
    private resolverRefresh: RouteResolverRefreshService,
    private productService: ProductService) {

    this.productService.productsChanged.subscribe(() => {
      this.resolverRefresh.refreshResolvers(o => o.key === 'product' || o.key === 'products');
    });
  }
}
