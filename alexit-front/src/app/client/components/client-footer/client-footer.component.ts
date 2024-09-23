import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../admin/services/auth.service';
import { FormsModule } from '@angular/forms';
import { AlexitService } from '../../../services/alexit.service';

@Component({
  selector: 'client-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.css'
})
export class ClientFooterComponent implements OnInit, AfterViewInit {

  emailInUse: boolean = false;

  emailInvalid: boolean = false;

  subscribers: { _id: string, email: string }[] = [];

  @ViewChildren("scroller") scrollers!: QueryList<ElementRef<HTMLDivElement>>;







  constructor(private auth: AuthService, private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.subscribers$.subscribe({ next: v => this.subscribers = v, error: err => console.log(err) });
  }
  ngAfterViewInit(): void {
    this.animateLogosSlide();
  }







  subscribeToNewsletter(input: HTMLInputElement, newsletterWarning: HTMLDialogElement) {
    if (input.validity.valid) {
      this.emailInvalid = false;
      const subscriber = this.subscribers.filter(s => s.email === input.value)[0];
      if (subscriber) {
        this.emailInUse = true
        if (this.emailInUse) newsletterWarning.showModal();
      } else {
        this.emailInUse = false;
        if (!this.emailInUse) {
          this.auth.confirmNewsletterSubscription(input.value).subscribe(() => newsletterWarning.showModal())
        }
      }
    } else {
      this.emailInvalid = true;
      if (this.emailInvalid) newsletterWarning.showModal();
    }
  }

  animateLogosSlide() {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let scroller of this.scrollers) {
        scroller.nativeElement.setAttribute('data-animated', 'true');
        const scrollerInner = scroller.nativeElement.querySelector('ul.scroller-inner');
        if (scrollerInner) {
          const scrollerContent = Array.from(scrollerInner.children);
          for (let item of scrollerContent) {
            const duplicatedItem = item.cloneNode(true) as any;
            duplicatedItem.setAttribute('aria-hidden', true);
            scrollerInner.appendChild(duplicatedItem);
          }
        }
      }
    }
  }






}
