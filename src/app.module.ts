import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SearchModule } from './modules/search/search.module';
import { MechanicsModule } from './modules/mechanics/mechanics.module';
import { AutoboxModulesModule } from './modules/autobox-modules/autobox-modules.module';
import { MechanicEarningsModule } from './modules/mechanic-earnings/mechanic-earnings.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    VehiclesModule,
    InspectionsModule,
    ChatModule,
    PaymentsModule,
    SearchModule,
    MechanicsModule,
    AutoboxModulesModule,
    MechanicEarningsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
