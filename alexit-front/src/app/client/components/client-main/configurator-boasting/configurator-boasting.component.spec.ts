import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguratorBoastingComponent } from './configurator-boasting.component';

describe('ConfiguratorBoastingComponent', () => {
  let component: ConfiguratorBoastingComponent;
  let fixture: ComponentFixture<ConfiguratorBoastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguratorBoastingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguratorBoastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
