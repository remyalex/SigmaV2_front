import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioActividadesAdminComponent } from './usuario-actividades-admin.component';

describe('ListasAdminComponent', () => {
  let component: UsuarioActividadesAdminComponent;
  let fixture: ComponentFixture<UsuarioActividadesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioActividadesAdminComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioActividadesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});