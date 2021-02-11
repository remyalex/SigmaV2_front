import { TestBed } from '@angular/core/testing';

import { ActaVolanteService } from './acta-volante.service';

describe('ActaVolanteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActaVolanteService = TestBed.get(ActaVolanteService);
    expect(service).toBeTruthy();
  });
});
