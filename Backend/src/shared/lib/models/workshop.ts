export interface WorkshopCreateInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  price: number;
  maxSeats?: number;
  formFields?: any;
  createdBy: string;
}

export interface WorkshopRegistrationInput {
  name: string;
  email: string;
  phone: string;
  college?: string;
  year?: string;
  branch?: string;
  experience?: string;
  formData?: any;
  workshopId: string;
}