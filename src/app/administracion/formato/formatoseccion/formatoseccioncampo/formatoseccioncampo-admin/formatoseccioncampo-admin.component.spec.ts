import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccioncampoAdminComponent } from './formatoseccioncampo-admin.component';

describe('FormatoseccioncampoAdminComponent', () => {
  let component: FormatoseccioncampoAdminComponent;
  let fixture: ComponentFixture<FormatoseccioncampoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccioncampoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccioncampoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
