import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomantenimientoEditComponent } from './tipomantenimiento-edit.component';

describe('TipomantenimientoEditComponent', () => {
  let component: TipomantenimientoEditComponent;
  let fixture: ComponentFixture<TipomantenimientoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipomantenimientoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomantenimientoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
