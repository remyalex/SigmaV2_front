import { TestBed } from '@angular/core/testing';

import { TipomantenimientoService } from './tipomantenimiento.service';

describe('TipomantenimientoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipomantenimientoService = TestBed.get(TipomantenimientoService);
    expect(service).toBeTruthy();
  });
});
