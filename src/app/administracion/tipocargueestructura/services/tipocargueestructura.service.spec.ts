import { TestBed } from '@angular/core/testing';

import { TipocargueestructuraService } from './tipocargueestructura.service';

describe('TipocargueestructuraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipocargueestructuraService = TestBed.get(TipocargueestructuraService);
    expect(service).toBeTruthy();
  });
});
