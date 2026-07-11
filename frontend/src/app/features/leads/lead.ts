import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lead } from './lead.model';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private readonly apiUrl = 'http://localhost:8080/api/leads';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl);
  }

  getById(id: number): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  getByCustomerId(customerId: number): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  create(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, lead);
  }

  update(id: number, lead: Lead): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${id}`, lead);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
