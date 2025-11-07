import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .where(
        '(message.senderId = :userId1 AND message.receiverId = :userId2) OR (message.senderId = :userId2 AND message.receiverId = :userId1)',
        { userId1, userId2 },
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async findUserConversations(userId: string): Promise<any[]> {
    // Get all unique conversations for a user
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    return messages;
  }

  async markAsRead(messageId: string): Promise<Message | null> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    if (message) {
      message.isRead = true;
      return this.messageRepository.save(message);
    }
    return null;
  }
}
