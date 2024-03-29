import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  private tokenKey = "token";

  constructor(private http: HttpClient,
    private router: Router) { }

  loadCurrentUser() {
    const token = localStorage.getItem(this.tokenKey);
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    return this.http.get(this.baseUrl + "account")
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem(this.tokenKey, user.token);
            this.currentUserSource.next(user);
          }
        })
      )
  }

  login(values: any) {
    return this.http.post(this.baseUrl + "account/login", values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem(this.tokenKey, user.token);
            this.currentUserSource.next(user);
          }
        })
      )
  }

  register(values: any) {
    return this.http.post(this.baseUrl + "account/register", values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem(this.tokenKey, user.token);
            this.currentUserSource.next(user);
          }

        })
      )
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSource.next(null);
    this.router.navigateByUrl("/");
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + "account/emailexists?email=" + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + "account/address")
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + "account/address", address);
  }
}
