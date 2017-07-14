import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProduct } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css']
})
export class ProductEditorComponent implements OnInit {
  product: IProduct;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(`Data was updated for ${this.constructor.name}.`);
      this.product = data['product'];
    });
  }

  saveProduct(): void {
    this.productService.saveProduct(this.product).subscribe();
  }
}
