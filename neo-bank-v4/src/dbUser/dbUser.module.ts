import { DbUserService } from './service/dbuser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountModule } from '../bank_account/bankAccount.module';
import { Module } from '@nestjs/common';
import { DbUserController } from './controller/dbUser.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User]),
    BankAccountModule,
  ],
  controllers: [DbUserController],
  providers: [DbUserService],
})
export class DbUserModule {}
