export interface Employee {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    gender: 'male' | 'female';
    DOB: string;  // Date string in ISO format, e.g., "2024-09-16"
    nationality: string;
    national_id: number;
    arrival_time: string;  // Time string, e.g., "12:12"
    leave_time: string;    // Time string, e.g., "13:13"
    salary: number;
    date_of_contract: string;  // Date string in ISO format, e.g., "2024-10-04"
    department: {
      id: number;
      name: string;
    } | null;  // Nullable if department is not assigned
  }