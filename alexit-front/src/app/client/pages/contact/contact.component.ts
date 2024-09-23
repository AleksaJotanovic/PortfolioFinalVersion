import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  contactForm: FormGroup = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    portfolio: new FormControl(""),
    message: new FormControl("")
  });



  constructor(private crud: CrudService) { }



  sendContactMessage() {
    this.crud.sendContactMessage(this.contactForm.value).subscribe({
      next: () => console.log('Contact message sent successfully'),
      error: e => console.log(e)
    });
    this.contactForm.reset();
  }



}
