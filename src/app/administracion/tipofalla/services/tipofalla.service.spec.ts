import { TestBed } from '@angular/core/testing';

import { TipofallaService } from './tipofalla.service';

describe('TipofallaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipofallaService = TestBed.get(TipofallaService);
    expect(service).toBeTruthy();
  });
});
