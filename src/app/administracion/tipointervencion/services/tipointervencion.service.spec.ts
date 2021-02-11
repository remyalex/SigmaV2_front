import { TestBed } from '@angular/core/testing';

import { TipointervencionService } from './tipointervencion.service';

describe('TipofallaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipointervencionService = TestBed.get(TipointervencionService);
    expect(service).toBeTruthy();
  });
});
