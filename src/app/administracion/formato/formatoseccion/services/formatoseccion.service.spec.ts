import { TestBed } from '@angular/core/testing';

import { FormatoseccionService } from './formatoseccion.service';

describe('FormatoseccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormatoseccionService = TestBed.get(FormatoseccionService);
    expect(service).toBeTruthy();
  });
});
