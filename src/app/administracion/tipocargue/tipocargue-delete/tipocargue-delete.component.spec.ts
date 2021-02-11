import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueDeleteComponent } from './tipocargue-delete.component';

describe('TipocargueDeleteComponent', () => {
  let component: TipocargueDeleteComponent;
  let fixture: ComponentFixture<TipocargueDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
