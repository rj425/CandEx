import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterAttachAComponent } from './offerLetterAttachA.component';

describe('OfferLetterAttachAComponent', () => {
  let component: OfferLetterAttachAComponent;
  let fixture: ComponentFixture<OfferLetterAttachAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterAttachAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterAttachAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
