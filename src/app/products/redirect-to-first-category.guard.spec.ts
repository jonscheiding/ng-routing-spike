import { TestBed, async, inject } from '@angular/core/testing';

import { CategoryRedirectGuard } from './category-redirect.guard';

describe('CategoryRedirectGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryRedirectGuard]
    });
  });

  it('should ...', inject([CategoryRedirectGuard], (guard: CategoryRedirectGuard) => {
    expect(guard).toBeTruthy();
  }));
});
