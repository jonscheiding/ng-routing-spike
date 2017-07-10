import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Injectable()
export class ProductResolverService implements Resolve<IProduct> {

  constructor(private productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    return this.productService.getProduct(+route.params['productId']);
  }
}
