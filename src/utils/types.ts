export interface IPerson {
    id: number,
    firstName: string,
    lastName: string,
    fullName?: string,
    email: string,
    city: string,
    registeredDate: Date | string;
    dsr?:string,
  }