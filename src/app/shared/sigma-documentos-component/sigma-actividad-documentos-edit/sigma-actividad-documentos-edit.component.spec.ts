import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaActividadDocumentosEditComponent } from './sigma-actividad-documentos-edit.component';

describe('SigmaActividadDocumentosEditComponent', () => {
  let component: SigmaActividadDocumentosEditComponent;
  let fixture: ComponentFixture<SigmaActividadDocumentosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaActividadDocumentosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaActividadDocumentosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
