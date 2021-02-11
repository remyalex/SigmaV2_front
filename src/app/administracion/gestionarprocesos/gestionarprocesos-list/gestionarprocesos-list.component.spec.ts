import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarprocesosListComponent } from './gestionarprocesos-list.component';

describe('GestionarprocesosListComponent', () => {
  let component: GestionarprocesosListComponent;
  let fixture: ComponentFixture<GestionarprocesosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarprocesosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarprocesosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
