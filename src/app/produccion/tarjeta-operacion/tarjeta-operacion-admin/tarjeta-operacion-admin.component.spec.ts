import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaOperacionAdminComponent } from './tarjeta-operacion-admin.component';

describe('TarjetaOperacionAdminComponent', () => {
  let component: TarjetaOperacionAdminComponent;
  let fixture: ComponentFixture<TarjetaOperacionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaOperacionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaOperacionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
