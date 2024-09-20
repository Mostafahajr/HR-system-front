import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRules } from '../../models/iRules';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralRulesService {
  private apiUrl: string = 'http://pioneer-back2.test/api/hour-rules';

  constructor(private http: HttpClient) { }

  getAllRules(): Observable<IRules[]> {
    return this.http.get<{ data: IRules[] }>(this.apiUrl).pipe(
      map((response: { data: any; }) => response.data) // Extract the `data` field
    );
  }

  addNewRule(rule: IRules): Observable<IRules> {
    return this.http.post<IRules>(this.apiUrl, rule);
  }

  getRule(ruleId: number): Observable<IRules> {
    return this.http.get<IRules>(`${this.apiUrl}/${ruleId}`);
  }

  deleteRule(ruleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ruleId}`);
  }

  updateRule(rule: IRules): Observable<IRules> {
    return this.http.put<IRules>(`${this.apiUrl}/${rule.id}`, rule);
  }
}
