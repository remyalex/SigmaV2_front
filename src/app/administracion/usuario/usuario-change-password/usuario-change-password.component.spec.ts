import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioChangePasswordComponent } from './usuario-change-password.component';

describe('UsuarioChangePasswordComponent', () => {
  let component: UsuarioChangePasswordComponent;
  let fixture: ComponentFixture<UsuarioChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
