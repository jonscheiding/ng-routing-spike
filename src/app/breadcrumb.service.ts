import { RouteResolverRefreshService } from './route-resolver-refresh.service';
import { IBreadcrumb } from './breadcrumb.service';
import { Router, Params, NavigationEnd, ActivatedRouteSnapshot, PRIMARY_OUTLET } from '@angular/router';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';

export interface IBreadcrumb {
  label: string,
  url: string,
  params: Params
}

export const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

@Injectable()
export class BreadcrumbService {
  breadcrumbs = new Array<IBreadcrumb>();

  constructor(private router: Router, private resolverRefresh: RouteResolverRefreshService) {
    this.router.events
      .filter(e => e instanceof NavigationEnd)
      .subscribe(() => this.updateBreadcrumbs());

    this.resolverRefresh.resolversRefreshed
      .subscribe(() => this.updateBreadcrumbs());
  }

  private updateBreadcrumbs() {
    this.breadcrumbs = this.getBreadcrumbsFromRouter();
  }

  private getBreadcrumbsFromRouter(): IBreadcrumb[] {
    const breadcrumbs = new Array<IBreadcrumb>();
    let route = this.router.routerState.root.snapshot;

    while(route != null) {
      const breadcrumb = this.getBreadcrumbFromRoute(route);
      if(breadcrumb !== null) {
        breadcrumbs.push(breadcrumb);
      }

      route = route.children.find(child => child.outlet === PRIMARY_OUTLET);
    }

    return breadcrumbs;
  }

  private getBreadcrumbFromRoute(route: ActivatedRouteSnapshot): IBreadcrumb {
    const url = route.url.map(segment => segment.path).join('/');
    const params = route.params;
    let label = route.data[ROUTE_DATA_BREADCRUMB];

    if(label === undefined) return null;
    if(typeof(label) === 'function') {
      label = label(route);
    }

    return { label, params, url };
  }
}
