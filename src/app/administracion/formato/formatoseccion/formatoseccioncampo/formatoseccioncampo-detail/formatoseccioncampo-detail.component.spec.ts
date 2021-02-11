import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccioncampoDetailComponent } from './formatoseccioncampo-detail.component';

describe('FormatoseccioncampoDetailComponent', () => {
  let component: FormatoseccioncampoDetailComponent;
  let fixture: ComponentFixture<FormatoseccioncampoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccioncampoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccioncampoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
