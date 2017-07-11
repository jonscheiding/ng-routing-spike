import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ProductService } from './product.service';

@Injectable()
export class RedirectToFirstCategoryGuard implements CanActivate {
  constructor(private productService: ProductService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.productService.getProducts()
      .map(products => products[0].category)
      .do(category => this.router.navigate(['/products', category]))
      .map(() => false);
  }
}
