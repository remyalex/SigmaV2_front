import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaOperacionListComponent } from './tarjeta-operacion-list.component';

describe('TarjetaOperacionListComponent', () => {
  let component: TarjetaOperacionListComponent;
  let fixture: ComponentFixture<TarjetaOperacionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaOperacionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaOperacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
