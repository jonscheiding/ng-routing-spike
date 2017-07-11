import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Injectable()
export class CurrentProduct {
  private productInternal: IProduct;

  get product(): IProduct {
    return this.productInternal;
  }

  constructor(private productService: ProductService) {
    this.productService.events.subscribe(() => {
      this.reloadProduct().subscribe();
    });
  }

  loadProduct(id: number): Observable<CurrentProduct> {
    return this.productService.getProduct(id)
      .map(product => {
        this.productInternal = product;
        return this;
      });
  }

  reloadProduct(): Observable<CurrentProduct> {
    if (this.product == null) {
      throw new Error('Cannot reload the current product because none is loaded.');
    }

    return this.loadProduct(this.product.id);
  }
}
