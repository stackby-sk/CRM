export interface Activity {
  id?: number;
  customerId: number;
  customerName?: string;
  type: string;
  dueDate?: string;
  status?: string;
  assignedToId?: number;
  assignedToName?: string;
}
