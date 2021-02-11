import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaOperacionCreateComponent } from './tarjeta-operacion-create.component';

describe('TarjetaOperacionCreateComponent', () => {
  let component: TarjetaOperacionCreateComponent;
  let fixture: ComponentFixture<TarjetaOperacionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaOperacionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaOperacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
