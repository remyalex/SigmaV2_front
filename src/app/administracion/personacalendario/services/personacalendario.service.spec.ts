import { TestBed } from '@angular/core/testing';

import { PersonacalendarioService } from './personacalendario.service';

describe('PersonacalendarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonacalendarioService = TestBed.get(PersonacalendarioService);
    expect(service).toBeTruthy();
  });
});
