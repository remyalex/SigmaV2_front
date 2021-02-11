import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarprocesosEditComponent } from './gestionarprocesos-edit.component';

describe('GestionarprocesosEditComponent', () => {
  let component: GestionarprocesosEditComponent;
  let fixture: ComponentFixture<GestionarprocesosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarprocesosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarprocesosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
