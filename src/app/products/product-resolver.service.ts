import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrentProduct } from './current-product';

@Injectable()
export class ProductResolverService implements Resolve<CurrentProduct> {
  constructor(private currentProduct: CurrentProduct) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CurrentProduct> {
    return this.currentProduct.loadProduct(+route.params['productId']);
  }
}
