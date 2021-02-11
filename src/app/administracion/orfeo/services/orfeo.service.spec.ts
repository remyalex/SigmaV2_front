import { TestBed } from '@angular/core/testing';

import { OrfeoService } from './orfeo.service';

describe('OrfeoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrfeoService = TestBed.get(OrfeoService);
    expect(service).toBeTruthy();
  });
});
