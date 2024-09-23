import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent {

}
