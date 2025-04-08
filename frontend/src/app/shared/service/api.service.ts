import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  get(url: string) {
    return this.httpClient.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      observe: 'response',
    });
  }

  post<T>(url: string, data: T) {
    return this.httpClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      observe: 'response',
    });
  }

  put<T>(url: string, data: T) {
    return this.httpClient.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      observe: 'response',
    });
  }

  patch<T>(url: string, data: T) {
    return this.httpClient.patch(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      observe: 'response',
    });
  }

  delete(url: string) {
    return this.httpClient.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      observe: 'response',
    });
  }
}
