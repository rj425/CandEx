import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterAttachCComponent } from './offerLetterAttachC.component';

describe('OfferLetterAttachCComponent', () => {
  let component: OfferLetterAttachCComponent;
  let fixture: ComponentFixture<OfferLetterAttachCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterAttachCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterAttachCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
