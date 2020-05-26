import { TestBed } from '@angular/core/testing';

import { WdsScaffoldingService } from './wds-scaffolding.service';

describe('WdsScaffoldingService', () => {
  let service: WdsScaffoldingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WdsScaffoldingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
