import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { InterviewService } from './interview.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/interview',
})
export class InterviewGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(InterviewGateway.name);

  constructor(private interviewService: InterviewService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_session')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    client.join(`session:${data.sessionId}`);
    client.emit('joined', { sessionId: data.sessionId });
  }

  @SubscribeMessage('submit_answer')
  async handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; questionId: string; answer: string; userId: string },
  ) {
    try {
      const result = await this.interviewService.submitAnswer(
        data.sessionId,
        data.userId,
        { questionId: data.questionId, answer: data.answer },
      );
      this.server.to(`session:${data.sessionId}`).emit('answer_evaluated', result);
    } catch (error: any) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('end_session')
  async handleEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userId: string },
  ) {
    try {
      const result = await this.interviewService.endSession(data.sessionId, data.userId);
      this.server.to(`session:${data.sessionId}`).emit('session_ended', result);
    } catch (error: any) {
      client.emit('error', { message: error.message });
    }
  }
}
