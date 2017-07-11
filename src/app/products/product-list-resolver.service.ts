import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ProductList } from './product-list';

@Injectable()
export class ProductListResolverService implements Resolve<ProductList> {
  constructor(private productList: ProductList) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductList> {
    return this.productList.loadProductList(route.params['category']);
  }
}
