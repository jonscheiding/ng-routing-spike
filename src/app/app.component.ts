import { RouteResolverRefreshService } from './route-resolver-refresh.service';
import { Router, Event, RouterState, NavigationEnd, ActivatedRoute, Resolve } from '@angular/router';
import { Component, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ProductListResolverService } from './products/product-list-resolver.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private firstRouterState: RouterState;

  title = 'app';

  constructor(private router: Router) {
    this.router.events.subscribe(e => this.onRouterEvent(e));
  }

  private onRouterEvent(e: Event) {
    console.log(e);
    if (e instanceof NavigationEnd && this.firstRouterState == null) {
      this.firstRouterState = this.router.routerState;
    }
  }
}
