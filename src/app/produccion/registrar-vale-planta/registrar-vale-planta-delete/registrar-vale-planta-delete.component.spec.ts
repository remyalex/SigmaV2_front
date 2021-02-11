import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarValePlantaDeleteComponent } from './registrar-vale-planta-delete.component';

describe('RegistrarValePlantaDeleteComponent', () => {
  let component: RegistrarValePlantaDeleteComponent;
  let fixture: ComponentFixture<RegistrarValePlantaDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarValePlantaDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarValePlantaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
