import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarValePlantaDetailComponent } from './registrar-vale-planta-detail.component';

describe('RegistrarValePlantaDetailComponent', () => {
  let component: RegistrarValePlantaDetailComponent;
  let fixture: ComponentFixture<RegistrarValePlantaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarValePlantaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarValePlantaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
