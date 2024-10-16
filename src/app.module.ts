import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [CommonModule, CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
