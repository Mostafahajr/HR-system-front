import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRules } from '../../models/iRules';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralRulesService {
  rulesApiUrl: any = 'http://localhost:3005/products';
  constructor(public http: HttpClient) {}

  getRules(): Observable<IRules[]> {
    return this.http.get<IRules[]>(this.rulesApiUrl);
  }
  addNewRules(rule: any) {
    return this.http.post(this.rulesApiUrl, rule);
  }
  getRule(ruleId: number) {
    return this.http.get(`${this.rulesApiUrl}/${ruleId}`);
  }
  deleteRule(ruleId: number) {
    return this.http.delete(`${this.rulesApiUrl}/${ruleId}`);
  }
  updateRule(rule: any, ruleId: number) {
    return this.http.put(`${this.rulesApiUrl}/${ruleId}`, rule);
  }
}
