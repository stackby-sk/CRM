import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction } from './interaction.model';

@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  private readonly apiUrl = 'http://localhost:8080/api/interactions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Interaction[]> {
    return this.http.get<Interaction[]>(this.apiUrl);
  }

  getByCustomerId(customerId: number): Observable<Interaction[]> {
    return this.http.get<Interaction[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  create(interaction: Interaction): Observable<Interaction> {
    return this.http.post<Interaction>(this.apiUrl, interaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
