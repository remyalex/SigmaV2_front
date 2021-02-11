import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoCreateComponent } from './formato-create.component';

describe('FormatoCreateComponent', () => {
  let component: FormatoCreateComponent;
  let fixture: ComponentFixture<FormatoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
