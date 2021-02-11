import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarValePlantaEditComponent } from './registrar-vale-planta-edit.component';

describe('RegistrarValePlantaEditComponent', () => {
  let component: RegistrarValePlantaEditComponent;
  let fixture: ComponentFixture<RegistrarValePlantaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarValePlantaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarValePlantaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
