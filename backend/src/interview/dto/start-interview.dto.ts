import { IsString, IsOptional, IsUUID, IsNumber, Min, Max, IsIn } from 'class-validator';

export class StartInterviewDto {
  @IsUUID()
  @IsOptional()
  resumeId?: string;

  @IsUUID()
  @IsOptional()
  jdId?: string;

  @IsString()
  @IsOptional()
  @IsIn(['technical', 'behavioral', 'hr', 'mixed'])
  type?: string;

  @IsNumber()
  @IsOptional()
  @Min(3)
  @Max(20)
  questionCount?: number;
}
