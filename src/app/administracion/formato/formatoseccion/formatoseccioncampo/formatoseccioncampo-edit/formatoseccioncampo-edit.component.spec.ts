import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccioncampoEditComponent } from './formatoseccioncampo-edit.component';

describe('FormatoseccioncampoEditComponent', () => {
  let component: FormatoseccioncampoEditComponent;
  let fixture: ComponentFixture<FormatoseccioncampoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccioncampoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccioncampoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
