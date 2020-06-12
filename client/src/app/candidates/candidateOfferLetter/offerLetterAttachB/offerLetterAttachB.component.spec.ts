import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterAttachBComponent } from './offerLetterAttachB.component';

describe('OfferLetterAttachBComponent', () => {
  let component: OfferLetterAttachBComponent;
  let fixture: ComponentFixture<OfferLetterAttachBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterAttachBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterAttachBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
