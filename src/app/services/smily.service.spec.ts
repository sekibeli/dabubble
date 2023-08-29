import { TestBed } from '@angular/core/testing';

import { SmilyService } from './smily.service';

describe('SmilyService', () => {
  let service: SmilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmilyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
