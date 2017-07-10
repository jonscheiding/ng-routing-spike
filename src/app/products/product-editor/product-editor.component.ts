import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IProduct } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css']
})
export class ProductEditorComponent implements OnInit {
  product: IProduct;

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.product = data['product']);
  }

  saveProduct(): void {
    const productId = this.product.id;
    this.productService.saveProduct(this.product).subscribe(() => {
      this.router.navigate(['/loading']).then(() => {
        this.router.navigate(['/products', productId]);
      });
    });
  }
}
