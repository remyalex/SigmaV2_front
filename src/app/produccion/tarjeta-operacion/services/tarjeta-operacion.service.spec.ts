import { TestBed } from '@angular/core/testing';

import { TarjetaOperacionService } from './tarjeta-operacion.service';

describe('TarjetaOperacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TarjetaOperacionService = TestBed.get(TarjetaOperacionService);
    expect(service).toBeTruthy();
  });
});
