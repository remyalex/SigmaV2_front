import { TestBed } from '@angular/core/testing';

import { EventousuarioService } from './eventousuario.service';

describe('EventousuarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventousuarioService = TestBed.get(EventousuarioService);
    expect(service).toBeTruthy();
  });
});
