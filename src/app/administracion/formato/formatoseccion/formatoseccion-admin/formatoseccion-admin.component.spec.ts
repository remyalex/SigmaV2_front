import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccionAdminComponent } from './formatoseccion-admin.component';

describe('FormatoseccionAdminComponent', () => {
  let component: FormatoseccionAdminComponent;
  let fixture: ComponentFixture<FormatoseccionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
