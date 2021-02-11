import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaFormEmailComponent } from './sigma-form-email.component';

describe('SigmaFormEmailComponent', () => {
  let component: SigmaFormEmailComponent;
  let fixture: ComponentFixture<SigmaFormEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
