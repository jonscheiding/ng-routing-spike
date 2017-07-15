import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProduct } from '../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.children);
    //
    // If the URL is /products, then this.route has no children.
    // And if we later navigate to /products/:productId, this
    // component's ngOnInit doesn't get called again.
    //
    // Without thinking about it, I was assuming that meant I
    // could never get to the children from this.route.
    //
  }

  get products(): IProduct[] {
    return this.route.snapshot.data['products'];
  }

  get selectedProduct(): IProduct {
    if(this.route.firstChild == null) {
      return null;
    }

    //
    // But the route object that we got passed will have children
    // eventually, and change detection will handle that
    //
    return this.route.firstChild.snapshot.data['product'];
  }
}
