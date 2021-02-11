import { TestBed } from '@angular/core/testing';

import { PlanillaoperacionesService } from './planillaoperaciones.service';

describe('PlanillaoperacionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanillaoperacionesService = TestBed.get(PlanillaoperacionesService);
    expect(service).toBeTruthy();
  });
});
