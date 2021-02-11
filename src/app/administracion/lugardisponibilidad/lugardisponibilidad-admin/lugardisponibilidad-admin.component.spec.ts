import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugardisponibilidadAdminComponent } from './lugardisponibilidad-admin.component';

describe('LugardisponibilidadAdminComponent', () => {
  let component: LugardisponibilidadAdminComponent;
  let fixture: ComponentFixture<LugardisponibilidadAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugardisponibilidadAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugardisponibilidadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
