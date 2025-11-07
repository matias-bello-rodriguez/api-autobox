import { Controller, Get, Post, Body, Param, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.create(createMessageDto);
  }

  @Get('conversations/:userId')
  findUserConversations(@Param('userId') userId: string) {
    return this.chatService.findUserConversations(userId);
  }

  @Get('conversation/:userId1/:userId2')
  findConversation(@Param('userId1') userId1: string, @Param('userId2') userId2: string) {
    return this.chatService.findConversation(userId1, userId2);
  }

  @Patch('messages/:id/read')
  markAsRead(@Param('id') id: string) {
    return this.chatService.markAsRead(id);
  }
}
