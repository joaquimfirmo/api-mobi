import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { DatabaseModule } from './common/database/database.module';
import { CityModule } from './city/city.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { RoutesModule } from './route/routes.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    CompanyModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    CityModule,
    VehiclesModule,
    RoutesModule,
    UsersModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
