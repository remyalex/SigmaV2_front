import { TestBed } from '@angular/core/testing';

import { EventorolService } from './eventorol.service';

describe('EventorolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventorolService = TestBed.get(EventorolService);
    expect(service).toBeTruthy();
  });
});
