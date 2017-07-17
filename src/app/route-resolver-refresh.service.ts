import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, Data, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';

export interface ShouldRefreshOptions {
  key: string,
  resolver: any,
  route: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
}

export type ShouldRefreshDelegate = (options: ShouldRefreshOptions) => boolean;

@Injectable()
export class RouteResolverRefreshService {
  private resolversRefreshedSubject = new Subject<void>();

  constructor(private router: Router, private injector: Injector) { }

  get resolversRefreshed(): Observable<void> {
    return this.resolversRefreshedSubject.asObservable();
  }

  refreshResolvers(shouldRefresh: ShouldRefreshDelegate) {
    this.refreshResolversInternal(shouldRefresh, this.router.routerState.root)
      .subscribe(() => this.resolversRefreshedSubject.next());
  }

  private refreshResolversInternal(shouldRefresh: ShouldRefreshDelegate, route: ActivatedRoute, data: Data = {})
    : Observable<any> {

    return this.getRefreshedData(shouldRefresh, route, data)
      .mergeMap(refreshedData => {
        this.pushUpdatedDataToRoute(refreshedData, route);

        const childObservables = route.children.map(
          child => this.refreshResolversInternal(shouldRefresh, child, refreshedData)
        );

        if(childObservables.length === 0) {
          return Observable.of([]);
        }

        return Observable.forkJoin(childObservables);
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
    const updatedData = {...route.snapshot.data, ...data};

    route.snapshot.data = updatedData;
    subject.next(updatedData);
  }

  private getRefreshedData(shouldRefresh: ShouldRefreshDelegate, route: ActivatedRoute, data: Data)
    : Observable<Data> {

    const refreshedData = {...data};
    const resolve = (route.routeConfig || {}).resolve || {};

    const refreshObservables = Object.keys(resolve)
      .filter(key => shouldRefresh({
        key,
        resolver: resolve[key],
        route: route.snapshot,
        routerState: this.router.routerState.snapshot
      }))
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
    // TODO: Replicate logic from @angular/router.
    //  - Update to handle lazy loading (we can't use this.injector, we have to find the right
    //    Injector instance for the module).  See Angular router source for details.
    //  - We can't assume that all resolvers are impls of Resolve.  They could just be functions.
    //    We need to check the value we got and call it appropriately.
    //  - We can't assume that the resolver returns an Observable.  We need to check
    //    if we got a value and if we did, wrap it in Observable.of.
    //

    const resolver = <Resolve<any>>this.injector.get(resolveConfig);
    return <Observable<any>>resolver.resolve(route.snapshot, this.router.routerState.snapshot);
  }
}
