import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarValePlantaCreateComponent } from './registrar-vale-planta-create.component';

describe('RegistrarValePlantaCreateComponent', () => {
  let component: RegistrarValePlantaCreateComponent;
  let fixture: ComponentFixture<RegistrarValePlantaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarValePlantaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarValePlantaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
