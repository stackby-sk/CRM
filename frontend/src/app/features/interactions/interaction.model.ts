export interface Interaction {
  id?: number;
  customerId: number;
  customerName?: string;
  userId?: number;
  userName?: string;
  type: string;
  notes?: string;
  timestamp?: string;
}
