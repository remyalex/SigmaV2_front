import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueCreateComponent } from './tipocargue-create.component';

describe('TipocargueCreateComponent', () => {
  let component: TipocargueCreateComponent;
  let fixture: ComponentFixture<TipocargueCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
