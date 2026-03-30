import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { SuggestionsService } from './suggestions.service';
import { QuestionGeneratorService } from './question-generator.service';
import { EmbeddingsService } from './embeddings.service';

@Module({
  providers: [
    AiService,
    SuggestionsService,
    QuestionGeneratorService,
    EmbeddingsService,
  ],
  exports: [
    AiService,
    SuggestionsService,
    QuestionGeneratorService,
    EmbeddingsService,
  ],
})
export class AiModule {}
