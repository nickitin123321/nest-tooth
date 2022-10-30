import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DiseaseService } from './modules/disease/disease.service';
import { DiseaseController } from './modules/disease/disease.controller';
import { DiseaseModule } from './modules/disease/disease.module';
import { ToothsModule } from './modules/tooths/tooths.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ToothsModule,
    DiseaseModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController, DiseaseController],
  providers: [AppService, DiseaseService],
})
export class AppModule {}
