import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomantenimientoCreateComponent } from './tipomantenimiento-create.component';

describe('TipomantenimientoCreateComponent', () => {
  let component: TipomantenimientoCreateComponent;
  let fixture: ComponentFixture<TipomantenimientoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipomantenimientoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomantenimientoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
