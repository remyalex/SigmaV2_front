import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarprocesosAdminComponent } from './gestionarprocesos-admin.component';

describe('GestionarprocesosAdminComponent', () => {
  let component: GestionarprocesosAdminComponent;
  let fixture: ComponentFixture<GestionarprocesosAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarprocesosAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarprocesosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
