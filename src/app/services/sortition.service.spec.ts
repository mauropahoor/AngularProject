import { TestBed } from '@angular/core/testing';

import { SortitionService } from './sortition.service';

describe('SortitionService', () => {
  let service: SortitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
