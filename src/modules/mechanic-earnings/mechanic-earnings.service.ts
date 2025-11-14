import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MechanicEarning } from './entities/mechanic-earning.entity';
import { CreateMechanicEarningDto } from './dto/create-mechanic-earning.dto';

// Configuración de comisiones
const DEFAULT_MECHANIC_COMMISSION = 70.0; // 70%
// const DEFAULT_PLATFORM_FEE = 30.0; // 30% - Calculado automáticamente

@Injectable()
export class MechanicEarningsService {
  constructor(
    @InjectRepository(MechanicEarning)
    private readonly earningRepository: Repository<MechanicEarning>,
  ) {}

  async create(
    createMechanicEarningDto: CreateMechanicEarningDto,
  ): Promise<MechanicEarning> {
    const earning = this.earningRepository.create(createMechanicEarningDto);
    return this.earningRepository.save(earning);
  }

  async createFromInspection(
    mechanicId: string,
    inspectionId: string,
    paymentId: string,
    totalAmount: number,
  ): Promise<MechanicEarning> {
    const commissionRate = DEFAULT_MECHANIC_COMMISSION;
    const earnedAmount = (totalAmount * commissionRate) / 100;
    const platformFee = totalAmount - earnedAmount;

    const earning = this.earningRepository.create({
      mechanicId,
      inspectionId,
      paymentId,
      totalAmount,
      commissionRate,
      earnedAmount,
      platformFee,
      status: 'pending',
    });

    return this.earningRepository.save(earning);
  }

  async findByMechanic(mechanicId: string): Promise<MechanicEarning[]> {
    return this.earningRepository.find({
      where: { mechanicId },
      relations: ['inspection', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBalance(mechanicId: string): Promise<{
    pendingBalance: number;
    availableBalance: number;
    withdrawnBalance: number;
    totalEarnings: number;
    totalInspections: number;
  }> {
    const earnings = await this.findByMechanic(mechanicId);

    const pendingBalance = earnings
      .filter((e) => e.status === 'pending')
      .reduce((sum, e) => sum + Number(e.earnedAmount), 0);

    const availableBalance = earnings
      .filter((e) => e.status === 'approved' || e.status === 'paid')
      .reduce((sum, e) => sum + Number(e.earnedAmount), 0);

    const withdrawnBalance = earnings
      .filter((e) => e.status === 'withdrawn')
      .reduce((sum, e) => sum + Number(e.earnedAmount), 0);

    const totalEarnings = earnings.reduce(
      (sum, e) => sum + Number(e.earnedAmount),
      0,
    );

    return {
      pendingBalance,
      availableBalance,
      withdrawnBalance,
      totalEarnings,
      totalInspections: earnings.length,
    };
  }

  async findOne(id: string): Promise<MechanicEarning> {
    const earning = await this.earningRepository.findOne({
      where: { id },
      relations: ['mechanic', 'inspection', 'payment'],
    });

    if (!earning) {
      throw new NotFoundException(`Ganancia con ID ${id} no encontrada`);
    }

    return earning;
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'paid' | 'withdrawn',
  ): Promise<MechanicEarning> {
    const earning = await this.findOne(id);
    earning.status = status;

    if (status === 'paid') {
      earning.paidAt = new Date();
    }

    return this.earningRepository.save(earning);
  }

  async approvePayout(id: string): Promise<MechanicEarning> {
    return this.updateStatus(id, 'approved');
  }

  async markAsPaid(id: string): Promise<MechanicEarning> {
    return this.updateStatus(id, 'paid');
  }

  async markAsWithdrawn(id: string): Promise<MechanicEarning> {
    return this.updateStatus(id, 'withdrawn');
  }
}
