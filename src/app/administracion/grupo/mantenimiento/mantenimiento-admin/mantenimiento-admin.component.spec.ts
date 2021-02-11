import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoAdminComponent } from './mantenimiento-admin.component';

describe('MantenimientoAdminComponent', () => {
  let component: MantenimientoAdminComponent;
  let fixture: ComponentFixture<MantenimientoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
