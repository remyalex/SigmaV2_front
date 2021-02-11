import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoinfoComponent } from './mantenimientoinfo.component';

describe('MantenimientoinfoComponent', () => {
  let component: MantenimientoinfoComponent;
  let fixture: ComponentFixture<MantenimientoinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
