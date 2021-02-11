import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaSumatoriasComponent } from './sigma-sumatorias.component';

describe('SigmaSumatoriasComponent', () => {
  let component: SigmaSumatoriasComponent;
  let fixture: ComponentFixture<SigmaSumatoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaSumatoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaSumatoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
