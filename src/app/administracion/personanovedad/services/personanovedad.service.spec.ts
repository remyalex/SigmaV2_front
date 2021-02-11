import { TestBed } from '@angular/core/testing';

import { PersonanovedadService } from './personanovedad.service';

describe('PersonanovedadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonanovedadService = TestBed.get(PersonanovedadService);
    expect(service).toBeTruthy();
  });
});
