import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccioncampoDeleteComponent } from './formatoseccioncampo-delete.component';

describe('FormatoseccioncampoDeleteComponent', () => {
  let component: FormatoseccioncampoDeleteComponent;
  let fixture: ComponentFixture<FormatoseccioncampoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccioncampoDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccioncampoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
