import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioActividadesListComponent } from './usuario-actividades-list.component';

describe('ListasListComponent', () => {
  let component: UsuarioActividadesListComponent;
  let fixture: ComponentFixture<UsuarioActividadesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioActividadesListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioActividadesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});