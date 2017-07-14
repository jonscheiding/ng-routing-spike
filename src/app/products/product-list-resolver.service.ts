import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/last';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Injectable()
export class ProductListResolverService implements Resolve<IProduct[]> {

  constructor(private productService: ProductService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct[]> {
    return this.productService.getProducts();
  }
}
