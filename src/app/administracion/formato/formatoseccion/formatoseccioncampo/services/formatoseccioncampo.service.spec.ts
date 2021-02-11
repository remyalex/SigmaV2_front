import { TestBed } from '@angular/core/testing';

import { FormatoseccioncampoService } from './formatoseccioncampo.service';

describe('FormatoseccioncampoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormatoseccioncampoService = TestBed.get(FormatoseccioncampoService);
    expect(service).toBeTruthy();
  });
});
