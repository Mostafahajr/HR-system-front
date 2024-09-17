export interface IHoliday {
  id: string;
  name: string;
  date: string;
  type: string; // Add the type field
  description?: string;
}
