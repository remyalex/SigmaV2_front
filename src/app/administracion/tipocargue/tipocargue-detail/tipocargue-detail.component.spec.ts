import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueDetailComponent } from './tipocargue-detail.component';

describe('TipocargueDetailComponent', () => {
  let component: TipocargueDetailComponent;
  let fixture: ComponentFixture<TipocargueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
