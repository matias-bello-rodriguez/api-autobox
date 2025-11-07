import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['inspection', 'user'] });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['inspection', 'user'],
    });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return payment;
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({ where: { userId }, relations: ['inspection'] });
  }

  async updateStatus(id: string, status: string, transactionId?: string): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = status;
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    return this.paymentRepository.save(payment);
  }
}
