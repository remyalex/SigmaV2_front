import { TestBed } from '@angular/core/testing';

import { InsumoExistenciaService } from './insumo-existencia.service';

describe('InsumoExistenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InsumoExistenciaService = TestBed.get(InsumoExistenciaService);
    expect(service).toBeTruthy();
  });
});
