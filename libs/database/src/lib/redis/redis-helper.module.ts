import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DriverTransactionEntity } from "@rail/database/driver-transaction.entity";
import { DriverWalletEntity } from "@rail/database/driver-wallet.entity";
import { DriverEntity } from "@rail/database/driver.entity";
import { SharedDriverService } from "@rail/order/shared-driver.service";
import { DriverRedisService } from "./driver-redis.service";
import { OrderRedisService } from "./order-redis.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([DriverEntity, DriverWalletEntity, DriverTransactionEntity])
    ],
    providers: [DriverRedisService, OrderRedisService, SharedDriverService],
    exports: [DriverRedisService, OrderRedisService]
})
export class RedisHelpersModule {}