import { TestBed } from '@angular/core/testing';

import { PlanillaOperacionService } from './personal-planta.service';

describe('PlanillaOperacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanillaOperacionService = TestBed.get(PlanillaOperacionService);
    expect(service).toBeTruthy();
  });
});
