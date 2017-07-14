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
    //
    // Make a copy of the data object so that if we replace a key, we don't change it
    // for other routes that aren't part of this one.
    //
    data = {...data};

    const resolve = (route.routeConfig || {}).resolve || {};
    const resolversToRefresh = Object.keys(resolve)
      .filter(key => shouldRefresh(key, resolve[key], route.snapshot))
      .map(key => {
        //
        // TODO: It's not a safe assumption that all resolvers are impls of Resolve.  They could
        // just be functions.  Fix this assumption.
        //
        const resolver = <Resolve<any>>this.injector.get(resolve[key]);
        //
        // TODO: We also can't assume that the resolver returns an Observable.  We need to check
        // if we got a value and if we did, wrap it in Observable.of.
        //
        return <Observable<any>>resolver.resolve(route.snapshot, this.router.routerState.snapshot)
          .do(result => data[key] = result);
      })

    const waitForResolvers = resolversToRefresh.length > 0
      ? Observable.forkJoin(...resolversToRefresh)
      : Observable.of([])
      ;

    waitForResolvers.subscribe(() => {
      if (Object.keys(data).length > 0) {
        const subject = <BehaviorSubject<Data>>route.data;
        subject.next({...route.snapshot.data, ...data});
      }

      for (const child of route.children) {
        this.refreshResolversInternal(shouldRefresh, child, data);
      }
    })
  }
}
