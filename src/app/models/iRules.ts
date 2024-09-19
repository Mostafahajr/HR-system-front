import { name } from './../../../node_modules/@leichtgewicht/ip-codec/types/index.d';
export interface IRules {
  id?: number;
  type: 'increase' | 'deduction';
  hour_amount: number;
}
