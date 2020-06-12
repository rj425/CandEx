import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeSearchComponent } from './resumeSearch.component';

describe('ResumeSearchComponent', () => {
  let component: ResumeSearchComponent;
  let fixture: ComponentFixture<ResumeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
