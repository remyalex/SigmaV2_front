import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarValePlantaListComponent } from './registrar-vale-planta-list.component';

describe('RegistrarValePlantaListComponent', () => {
  let component: RegistrarValePlantaListComponent;
  let fixture: ComponentFixture<RegistrarValePlantaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarValePlantaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarValePlantaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
