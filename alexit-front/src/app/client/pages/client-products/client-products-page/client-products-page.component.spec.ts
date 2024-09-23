import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProductsPageComponent } from './client-products-page.component';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';

describe('ClientProductsPageComponent', () => {
  let component: ClientProductsPageComponent;
  let fixture: ComponentFixture<ClientProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProductsPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClientProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
