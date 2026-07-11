export interface Lead {
  id?: number;
  customerId: number;
  customerName?: string;
  source: string;
  status?: string;
  value: number;
  assignedToId?: number;
  assignedToName?: string;
  createdAt?: string;
}
