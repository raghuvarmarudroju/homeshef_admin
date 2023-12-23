export class Rider {
  id: number = 0;
  username: string = '';
  password: string = '';  
  rider!: RiderProfile;
  settings!: UserSettings;
  is_active: any;
  is_verified: any;
  created_at: any;
}

export class RiderProfile {  
  id: number = 0;
  user_id: number = 0;  
  driving_license: string='';
  bike_info: string = '';
  image: string = '';
}

export class UserSettings{
  is_active: boolean = false;
  is_verified: boolean = false;
  registrationDate!: Date;
  joinedDate!: Date;
}