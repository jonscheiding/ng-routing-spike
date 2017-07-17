import { Router, Event, RouterState, NavigationEnd, ActivatedRoute, Resolve } from '@angular/router';
import { Component, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { BreadcrumbService } from './breadcrumb.service';
import { RouteResolverRefreshService } from './route-resolver-refresh.service';
import { ProductListResolverService } from './products/product-list-resolver.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router, private breadcrumbService: BreadcrumbService) { }

  get breadcrumbs() {
    return this.breadcrumbService.breadcrumbs;
  }
}
