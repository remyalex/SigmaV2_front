import { TestBed } from '@angular/core/testing';

import { ActaVolanteResidenteService } from './acta-volante-residente.service';

describe('ActaVolanteResidenteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActaVolanteResidenteService = TestBed.get(ActaVolanteResidenteService);
    expect(service).toBeTruthy();
  });
});
