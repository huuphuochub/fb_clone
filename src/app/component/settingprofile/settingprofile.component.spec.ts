import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingprofileComponent } from './settingprofile.component';

describe('SettingprofileComponent', () => {
  let component: SettingprofileComponent;
  let fixture: ComponentFixture<SettingprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
