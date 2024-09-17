export interface SalaryData {
  name: string;
  salary: string;
  department: {
    id: number;
    department_name: string;
  };
  attended_days: number;
  absent_days: number;
  total_bonus_minutes: number;
  total_penalty_minutes: number;
  total_bonus_egp: number;
  total_penalty_egp: number;
  net_salary: number;
  daily_records: {
    date: string;
    penalty_minutes: number;
    bonus_minutes: number;
  }[];
}