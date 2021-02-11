import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomantenimientoDetailComponent } from './tipomantenimiento-detail.component';

describe('TipomantenimientoDetailComponent', () => {
  let component: TipomantenimientoDetailComponent;
  let fixture: ComponentFixture<TipomantenimientoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipomantenimientoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomantenimientoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
