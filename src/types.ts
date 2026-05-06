export interface Class {
  id: string;
  name: string;
  grade: string;
  description: string;
  createdAt: string;
}

export interface Student {
  id: string;
  nameKh: string;
  nameEn: string;
  dob: string;
  admissionDate: string;
  classId: string;
  paymentDay: number;
  notes: string;
  active: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  classId: string;
  month: number; // 0-11
  year: number;
  amount: number;
  currency: "KHR" | "USD";
  status: "paid" | "unpaid";
  paymentDate: string;
  invoiceNumber: string;
  notes: string;
}

export interface EditHistory {
  date: string;
  oldAmount: number;
  newAmount: number;
  reason: string;
}

export interface Invoice {
  id: string;
  paymentId: string;
  qrCodeData: string;
  createdAt: string;
  editHistory: EditHistory[];
}

export interface Database {
  classes: Class[];
  students: Student[];
  payments: Payment[];
  invoices: Invoice[];
}
