import { TestBed } from '@angular/core/testing';

import { EstadoMaquinariaPropioService } from './estado-maquinaria-propio.service';

describe('EstadoMaquinariaPropioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstadoMaquinariaPropioService = TestBed.get(EstadoMaquinariaPropioService);
    expect(service).toBeTruthy();
  });
});
