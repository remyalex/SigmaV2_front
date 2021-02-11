import { TestBed } from '@angular/core/testing';

import { IntervencionService } from './intervencion.service';

describe('IntervencionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntervencionService = TestBed.get(IntervencionService);
    expect(service).toBeTruthy();
  });
});
