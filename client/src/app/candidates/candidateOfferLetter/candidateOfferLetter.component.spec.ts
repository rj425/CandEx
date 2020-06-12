import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateofferletterComponent } from './candidateOfferLetter.component';

describe('CandidateofferletterComponent', () => {
  let component: CandidateofferletterComponent;
  let fixture: ComponentFixture<CandidateofferletterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateofferletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateofferletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
