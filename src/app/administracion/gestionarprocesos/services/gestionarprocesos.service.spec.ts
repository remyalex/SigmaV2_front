import { TestBed } from '@angular/core/testing';

import { GestionarprocesosService } from './gestionarprocesos.service';

describe('GestionarprocesosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionarprocesosService = TestBed.get(GestionarprocesosService);
    expect(service).toBeTruthy();
  });
});
