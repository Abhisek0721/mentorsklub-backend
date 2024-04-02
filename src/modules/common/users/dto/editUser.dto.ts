import { IsObject, IsOptional, IsString } from 'class-validator';

class LocationDTO {
  @IsOptional()
  @IsString()
  latitude: number;

  @IsOptional()
  @IsString()
  longitude: number;

  @IsOptional()
  @IsString()
  roadName: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
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
