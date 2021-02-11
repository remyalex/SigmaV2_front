import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomantenimientoAdminComponent } from './tipomantenimiento-admin.component';

describe('TipomantenimientoAdminComponent', () => {
  let component: TipomantenimientoAdminComponent;
  let fixture: ComponentFixture<TipomantenimientoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipomantenimientoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomantenimientoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
