import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CurrentProduct } from '../current-product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css']
})
export class ProductEditorComponent implements OnInit {
  currentProduct: CurrentProduct;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.currentProduct = data['product']);
  }

  saveProduct(): void {
    this.productService.saveProduct(this.currentProduct.product).subscribe();
  }
}
