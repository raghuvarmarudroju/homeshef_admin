export class User {
  user_id(user_id: any) {
    throw new Error('Method not implemented.');
  }
  id: number = 0;
  username: string = '';
  password: string = '';  
  profile!: UserProfile;
  address!: Address;
  contacts!: UserContacts;
  social!: UserSocial;
  settings!: UserSettings;
  cuisines: any[] =[];
}

export class UserProfile {  
  name: string = '';
  surname: string = '';  
  birthday!: Object;
  gender: string = '';
  image: string = '';
}
export class Address {  
  id: number= 0; 
  uid :string = '';
  user_id :number = 0;
  number: string = '';
  avatar: string = '';
  title:string = '';
  street:string = '';
  email: string = '';
  name: string = '';
  address: string = '';
  landmark: string = '';
  house: string = '';
  city: string = '';
  lat: string = '';
  lng: string = '';
  pincode:string = '';
}
export class UserWork {
  company: string = '';
  position: string = '';
  salary: number = 0;
}

export class UserContacts{
  email: string = '';
  phone: string = '';
  address: string = '';  
}

export class UserSocial {
  facebook: string = '';
  twitter: string = '';
  google: string = '';
}

export class UserSettings{
  isActive: boolean = false;
  isVerified: boolean = false;
  registrationDate!: Date;
  joinedDate!: Date;
}