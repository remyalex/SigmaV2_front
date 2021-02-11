import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueEditComponent } from './tipocargue-edit.component';

describe('TipocargueEditComponent', () => {
  let component: TipocargueEditComponent;
  let fixture: ComponentFixture<TipocargueEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
