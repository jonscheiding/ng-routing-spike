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
    console.log(route);
    return this.productService.getProducts();
  }

  refresh() {
    const routes = this.findRoutesForResolver();

    for (const r of routes) {
      this.resolve(r.route.snapshot, this.router.routerState.snapshot).last()
        .subscribe(data => this.updateRoutesForResolver(r.route, r.key, data));
    }
  }

  private updateRoutesForResolver(route: ActivatedRoute, key: string, data: IProduct[]) {
    const subject = <BehaviorSubject<Data>>route.data;
    const newData = {
      ...route.snapshot.data,
      [key]: data
    };

    subject.next(newData);

    for (const child of route.children) {
      if (child.routeConfig) {
        if (child.routeConfig.resolve && child.routeConfig.resolve[key]) {
          continue
        };
        if (child.routeConfig.data && child.routeConfig.data[key]) {
          continue
        };
        continue;
      }

      this.updateRoutesForResolver(child, key, data);
    }
  }

  private findRoutesForResolver(route = this.router.routerState.root): {key: string, route: ActivatedRoute}[] {
    const routes: {key: string, route: ActivatedRoute}[] = [];

    if (route.routeConfig) {
      const resolve = route.routeConfig.resolve || {};
      for (const key of Object.keys(resolve)) {
        if (resolve[key] === ProductListResolverService) {
          routes.push({key, route});
        }
      }
    }

    for (const child of route.children) {
      routes.push(...this.findRoutesForResolver(child));
    }

    return routes;
  }
}
