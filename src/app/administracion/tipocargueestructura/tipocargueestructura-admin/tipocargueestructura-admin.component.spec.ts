import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueestructuraAdminComponent } from './tipocargueestructura-admin.component';

describe('TipocargueestructuraAdminComponent', () => {
  let component: TipocargueestructuraAdminComponent;
  let fixture: ComponentFixture<TipocargueestructuraAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueestructuraAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueestructuraAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
