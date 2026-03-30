import { IsString, IsUUID, MinLength } from 'class-validator';

export class SubmitAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @MinLength(10)
  answer: string;
}
