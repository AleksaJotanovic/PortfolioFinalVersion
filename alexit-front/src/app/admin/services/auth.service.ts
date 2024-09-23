import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls } from '../../../middlewares/api.urls';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {




  constructor(private http: HttpClient, private cookies: CookieService) { }



  loginService(loginObj: { email: string, password: string }) {
    return this.http.post<any>(`${apiUrls.authApi}login`, loginObj, { withCredentials: true });
  }

  customerLoginService(loginObj: { email: string, password: string }) {
    return this.http.post<any>(`${apiUrls.authApi}customer-login`, loginObj, { withCredentials: true });
  }

  sendPasswordResetMail(email: string) {
    return this.http.post<any>(`${apiUrls.authApi}send-email`, { email: email });
  }

  resetPasswordService(resetObj: any) {
    return this.http.post<any>(`${apiUrls.authApi}reset-password`, resetObj);
  }

  get isAdminLoggedIn(): boolean {
    if (localStorage.getItem("user_id") && this.cookies.get("access_token")) {
      return true;
    } else {
      return false
    }
  }

  get isCustomerLoggedIn(): boolean {
    if (localStorage.getItem("customer_id") && this.cookies.get("customer_token")) {
      return true;
    } else {
      return false;
    }
  }

  confirmNewsletterSubscription(email: string) {
    return this.http.post<any>(apiUrls.newsletterApi + 'confirm-subscription', { email: email });
  }

}
