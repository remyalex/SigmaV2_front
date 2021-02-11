import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomantenimientoDeleteComponent } from './tipomantenimiento-delete.component';

describe('TipomantenimientoDeleteComponent', () => {
  let component: TipomantenimientoDeleteComponent;
  let fixture: ComponentFixture<TipomantenimientoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipomantenimientoDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomantenimientoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
