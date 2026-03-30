import { IsString, IsOptional, MinLength, IsUUID } from 'class-validator';

export class MatchJdDto {
  @IsUUID()
  resumeId: string;

  @IsString()
  @MinLength(2)
  jobTitle: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @MinLength(50)
  description: string;
}
