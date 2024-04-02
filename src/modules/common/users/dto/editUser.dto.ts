import { IsObject, IsOptional, IsString, IsNumber } from 'class-validator';

class LocationDTO {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  roadName: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;
}

export class EditUserDTO {
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsObject()
  location: LocationDTO;
}
