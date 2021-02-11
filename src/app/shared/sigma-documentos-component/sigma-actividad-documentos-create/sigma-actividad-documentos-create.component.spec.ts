import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaActividadDocumentosCreateComponent } from './sigma-actividad-documentos-create.component';

describe('SigmaActividadDocumentosCreateComponent', () => {
  let component: SigmaActividadDocumentosCreateComponent;
  let fixture: ComponentFixture<SigmaActividadDocumentosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaActividadDocumentosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaActividadDocumentosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
