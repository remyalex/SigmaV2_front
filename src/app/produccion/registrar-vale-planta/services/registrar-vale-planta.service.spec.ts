import { TestBed } from '@angular/core/testing';

import { RegistrarValePlantaService } from './registrar-vale-planta.service';

describe('RegistrarValePlantaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrarValePlantaService = TestBed.get(RegistrarValePlantaService);
    expect(service).toBeTruthy();
  });
});
