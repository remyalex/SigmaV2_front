import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomantenimientoListComponent } from './tipomantenimiento-list.component';

describe('TipomantenimientoListComponent', () => {
  let component: TipomantenimientoListComponent;
  let fixture: ComponentFixture<TipomantenimientoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipomantenimientoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomantenimientoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
