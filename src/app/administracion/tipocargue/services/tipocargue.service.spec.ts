import { TestBed } from '@angular/core/testing';

import { TipocargueService } from './tipocargue.service';

describe('TipocargueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipocargueService = TestBed.get(TipocargueService);
    expect(service).toBeTruthy();
  });
});
