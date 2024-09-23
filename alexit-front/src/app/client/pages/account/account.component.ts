import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { AccountDetailsComponent } from './account-details/account-details.component';

@Component({
  selector: 'account',
  standalone: true,
  imports: [RouterOutlet, RouterLink, UserPanelComponent, AccountDetailsComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
}
