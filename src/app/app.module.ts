import { RouteResolverRefreshService } from './route-resolver-refresh.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductData } from './products/product-data';

import { AppComponent } from './app.component';

import { ProductsModule } from './products/products.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(ProductData, { delay: 500 }),
    ProductsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ])
  ],
  providers: [RouteResolverRefreshService],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
