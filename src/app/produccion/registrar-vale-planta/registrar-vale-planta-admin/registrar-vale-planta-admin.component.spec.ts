import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarValePlantaAdminComponent } from './registrar-vale-planta-admin.component';

describe('RegistrarValePlantaAdminComponent', () => {
  let component: RegistrarValePlantaAdminComponent;
  let fixture: ComponentFixture<RegistrarValePlantaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarValePlantaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarValePlantaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
