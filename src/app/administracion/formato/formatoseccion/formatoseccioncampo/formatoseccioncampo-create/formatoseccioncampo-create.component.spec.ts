import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccioncampoCreateComponent } from './formatoseccioncampo-create.component';

describe('FormatoseccioncampoCreateComponent', () => {
  let component: FormatoseccioncampoCreateComponent;
  let fixture: ComponentFixture<FormatoseccioncampoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccioncampoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccioncampoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
