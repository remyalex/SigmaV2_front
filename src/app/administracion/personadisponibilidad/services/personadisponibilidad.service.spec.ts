import { TestBed } from '@angular/core/testing';

import { PersonadisponibilidadService } from './personadisponibilidad.service';

describe('PersonadisponibilidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonadisponibilidadService = TestBed.get(PersonadisponibilidadService);
    expect(service).toBeTruthy();
  });
});
