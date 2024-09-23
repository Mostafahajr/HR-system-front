// iEmployeesByDepartment.ts
export interface Employee {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  gender: 'male' | 'female';
  DOB: string;
  nationality: string;
  national_id: number;
  arrival_time: string;
  leave_time: string;
  salary: number;
  date_of_contract: string;
  department: {
    id: number;
    name: string;
  } | null;
}

export interface EmployeesByDepartment {
  [departmentName: string]: { Name: string; ArrivalTime: string; DepartureTime: string }[];
}
