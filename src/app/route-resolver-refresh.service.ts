import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, Data, Resolve } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

export type ShouldRefreshDelegate = (key: string, resolver: any, route: ActivatedRouteSnapshot) => boolean;

@Injectable()
export class RouteResolverRefreshService {
  constructor(private router: Router, private injector: Injector) { }

  refreshResolvers(shouldRefresh: ShouldRefreshDelegate) {
    this.refreshResolversInternal(shouldRefresh, this.router.routerState.root);
  }

  private refreshResolversInternal(shouldRefresh: ShouldRefreshDelegate, route: ActivatedRoute, data: Data = {}) {
    this.getRefreshedData(shouldRefresh, route, data)
      .subscribe(refreshedData => {
        this.pushUpdatedDataToRoute(refreshedData, route);

        for (const child of route.children) {
          this.refreshResolversInternal(shouldRefresh, child, refreshedData);
        }
      });
  }

  private pushUpdatedDataToRoute(data: Data, route: ActivatedRoute) {
    if (Object.keys(data).length === 0) {
      return;
    }

    //
    // Here's where we cheat.  ActivatedRoute.data is only exposed as an Observable,
    // but underneath it's a BehaviorSubject.  This is an implementation detail and
    // could change in future versions of Angular.
    //
    const subject = <BehaviorSubject<Data>>route.data;
    subject.next({...route.snapshot.data, ...data});
  }

  private getRefreshedData(shouldRefresh: ShouldRefreshDelegate, route: ActivatedRoute, data: Data)
    : Observable<Data> {

    const refreshedData = {...data};
    const resolve = (route.routeConfig || {}).resolve || {};

    const refreshObservables = Object.keys(resolve)
      .filter(key => shouldRefresh(key, resolve[key], route.snapshot))
      .map(key => this
        .executeResolver(resolve[key], route)
        .do(result => refreshedData[key] = result)
      );

    if (refreshObservables.length === 0) {
      return Observable.of(refreshedData);
    }

    return Observable
      .forkJoin(...refreshObservables)
      .map(() => refreshedData);
  }

  private executeResolver(resolveConfig: any, route: ActivatedRoute) {
    //
    // TODO: Update to handle lazy loading (we can't use this.injector, we have to find the right)
    // one for the module.  See Angular router source for details.
    //
    // TODO: We can't assume that all resolvers are impls of Resolve.  They could just be functions.
    // We need to check the value we got and call it appropriately.
    //
    const resolver = <Resolve<any>>this.injector.get(resolveConfig);

    //
    // TODO: We can't assume that the resolver returns an Observable.  We need to check
    // if we got a value and if we did, wrap it in Observable.of.
    //
    return <Observable<any>>resolver.resolve(route.snapshot, this.router.routerState.snapshot);
  }
}
