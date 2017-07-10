import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IProduct } from './product';

@Injectable()
export class ProductService {
    private baseUrl = 'api/products';

    productUpdated = new Subject<IProduct>();
    products: IProduct[];
    productCategory: string;

    constructor(private http: Http) { }

    getProducts(productCategory: string): Observable<IProduct[]> {
      if (this.products && this.productCategory === productCategory) {
        return Observable.of(this.products)
      };

      return this.getProductsInternal(productCategory)
        .do(data => {
          console.log('getProducts: ' + JSON.stringify(data));
          this.products = data;
          this.productCategory = productCategory;
        });
    }

    getProduct(id: number): Observable<IProduct> {
        if (id === 0) {
            return Observable.of(this.initializeProduct());
        };
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(url)
            .map(this.extractData)
            .do(data => console.log('getProduct: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    deleteProduct(id: number): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/${id}`;
        return this.http.delete(url, options)
            .do(data => console.log('deleteProduct: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    saveProduct(product: IProduct): Observable<IProduct> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });

        if (product.id === 0) {
            return this.createProduct(product, options);
        }
        return this.updateProduct(product, options);
    }

    private createProduct(product: IProduct, options: RequestOptions): Observable<IProduct> {
        product.id = undefined;
        return this.http.post(this.baseUrl, product, options)
            .map(this.extractData)
            .do(data => console.log('createProduct: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private updateProduct(product: IProduct, options: RequestOptions): Observable<IProduct> {
        const url = `${this.baseUrl}/${product.id}`;
        return this.http.put(url, {...product, releaseDate: new Date().toString()}, options)
            .map(() => product)
            .do(data => {
              console.log('updateProduct: ' + JSON.stringify(data));
              this.reloadProduct(product);
            })
            .catch(this.handleError);
    }

    private extractData(response: Response) {
        const body = response.json();
        return body.data || {};
    }

    private reloadProduct(product: IProduct) {
      this.getProduct(product.id).subscribe(productResult => {
        Object.assign(product, productResult);
      });

      this.getProductsInternal(this.productCategory)
        .subscribe(data => {
          for (let i = 0; i < data.length; i++) {
            this.products[i] = data[i];
          }
        });
    }

    private getProductsInternal(productCategory: string): Observable<IProduct[]> {
      return this.http.get(this.baseUrl)
          .map(this.extractData)
          .map((data: IProduct[]) => {
            return data.filter(p => p.category === productCategory);
          })
          .catch(this.handleError);
    }

    private handleError(error: Response): Observable<any> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    initializeProduct(): IProduct {
        // Return an initialized object
        return {
            id: 0,
            productName: null,
            productCode: null,
            category: null,
            tags: [],
            releaseDate: null,
            price: null,
            description: null,
            starRating: null,
            imageUrl: null
        };
    }
}
