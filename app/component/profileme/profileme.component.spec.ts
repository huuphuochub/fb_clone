import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilemeComponent } from './profileme.component';

describe('ProfilemeComponent', () => {
  let component: ProfilemeComponent;
  let fixture: ComponentFixture<ProfilemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
