import { TestBed } from '@angular/core/testing';

import { LugarService } from './lugar.service';

describe('LugarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LugarService = TestBed.get(LugarService);
    expect(service).toBeTruthy();
  });
});
