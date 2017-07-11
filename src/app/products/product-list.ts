import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IProduct } from './product';
import { ProductService, ProductCreated, ProductUpdated } from './product.service';

@Injectable()
export class ProductList {
  private productsInternal: IProduct[];
  private category: string = null;

  get products(): IProduct[] {
    return this.productsInternal;
  }

  constructor(private productService: ProductService) {
    this.productService.events.subscribe(() => {
      this.reloadProductList().subscribe();
    });
  }

  loadProductList(category: string): Observable<ProductList> {
    return this.productService.getProducts()
      .map(products => products.filter(p => p.category === category))
      .map(products => {
        this.productsInternal = products;
        this.category = category;
        return this;
      });
  }

  reloadProductList(): Observable<ProductList> {
    if (this.category === null) {
      return Observable.throw('Cannot reload the product list because it was never loaded.');
    }

    return this.loadProductList(this.category);
  }
}
