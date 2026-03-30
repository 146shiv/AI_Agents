import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResumeService } from './resume.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = diskStorage({
  destination: './uploads/resumes',
  filename: (_req, file, cb) => {
    cb(null, `${uuid()}${extname(file.originalname)}`);
  },
});

@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({
            fileType:
              /(pdf|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser('sub') userId: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.resumeService.processResume(userId, file);
  }

  @Get()
  list(@CurrentUser('sub') userId: string) {
    return this.resumeService.listResumes(userId);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.resumeService.getResume(id, userId);
  }

  @Get(':id/analysis')
  getAnalysis(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.resumeService.getAnalysis(id, userId);
  }

  @Post(':id/reanalyze')
  reanalyze(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.resumeService.reanalyze(id, userId);
  }
}
