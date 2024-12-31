import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { DatabaseModule } from './common/database/database.module';
import { CityModule } from './city/city.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    CompanyModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    CityModule,
    VehiclesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
