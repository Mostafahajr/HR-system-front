export interface SalaryData {
  id: number; // Add this line
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
  contract_arrival_time?: string | null; // Add this line
  contract_leave_time?: string | null;   // Add this line
  daily_records: {
    date: string;
    arrival_time: string | null;
    leave_time: string | null;
    penalty_minutes: number;
    bonus_minutes: number;
  }[];
}
