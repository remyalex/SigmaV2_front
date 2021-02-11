import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoRemoveComponent } from './mantenimiento-remove.component';

describe('MantenimientoRemoveComponent', () => {
  let component: MantenimientoRemoveComponent;
  let fixture: ComponentFixture<MantenimientoRemoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoRemoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
