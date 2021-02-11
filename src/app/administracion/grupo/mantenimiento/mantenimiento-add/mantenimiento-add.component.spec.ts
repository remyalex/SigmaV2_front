import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoAddComponent } from './mantenimiento-add.component';

describe('MantenimientoAddComponent', () => {
  let component: MantenimientoAddComponent;
  let fixture: ComponentFixture<MantenimientoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
