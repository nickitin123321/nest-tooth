import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 50)
  readonly password: string;
}
