import { TestBed } from '@angular/core/testing';

import { LugardisponibilidadService } from './lugardisponibilidad.service';

describe('LugardisponibilidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LugardisponibilidadService = TestBed.get(LugardisponibilidadService);
    expect(service).toBeTruthy();
  });
});
