import { TestBed, inject } from '@angular/core/testing';

import { RouteResolverRefreshService } from './route-resolver-refresh.service';

describe('RouteResolverRefreshService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteResolverRefreshService]
    });
  });

  it('should be created', inject([RouteResolverRefreshService], (service: RouteResolverRefreshService) => {
    expect(service).toBeTruthy();
  }));
});
