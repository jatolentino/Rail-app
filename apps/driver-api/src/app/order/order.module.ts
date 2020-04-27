import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisPubSubProvider } from '@rail/database';
import { DriverTransactionEntity } from '@rail/database/driver-transaction.entity';
import { DriverWalletEntity } from '@rail/database/driver-wallet.entity';
import { DriverEntity } from '@rail/database/driver.entity';
import { RequestEntity } from '@rail/database/request.entity';
import { ProviderTransactionEntity } from '@rail/database/provider-transaction.entity';
import { ProviderWalletEntity } from '@rail/database/provider-wallet.entity';
import { RiderEntity } from '@rail/database/rider-entity';
import { RiderTransactionEntity } from '@rail/database/rider-transaction.entity';
import { RiderWalletEntity } from '@rail/database/rider-wallet.entity';
import { ServiceCategoryEntity } from '@rail/database/service-category.entity';
import { ServiceEntity } from '@rail/database/service.entity';
import { FirebaseNotificationModule } from '@rail/order/firebase-notification-service/firebase-notification-service.module';
import { GoogleServicesModule } from '@rail/order/google-services/google-services.module';
import { SharedOrderService } from '@rail/order/shared-order.service';
import { SharedProviderService } from '@rail/order/shared-provider.service';
import { SharedFleetService } from '@rail/order/shared-fleet.service';
import { RegionModule } from '@rail/order/region/region.module';
import { SharedRiderService } from '@rail/order/shared-rider.service';
import { ServiceService } from '@rail/order/service.service';

import { OrderDTO } from './dto/order.dto';
import { OrderResolver } from './order.resolver';
import { DriverOrderQueryService } from './driver-order.query-service';
import { RedisHelpersModule } from '@rail/redis/redis-helper.module';
import { CronJobService } from './cron-job.service';
import { DriverModule } from '../driver/driver.module';
import { SharedDriverService } from '@rail/order/shared-driver.service';
import { OrderService } from './order.service';
import { FleetWalletEntity } from '@rail/database/fleet-wallet.entity';
import { FleetTransactionEntity } from '@rail/database/fleet-transaction.entity';
import { OrderSubscriptionService } from './orde-subscription.service';
import { RiderDTO } from './dto/rider.dto';
import { RequestActivityEntity } from '@rail/database/request-activity.entity';
import { FleetEntity } from '@rail/database/fleet.entity';
import { ServiceOptionEntity } from '@rail/database/service-option.entity';
import { CommonCouponModule } from "@rail/coupon/common-coupon.module";

@Module({
  imports: [
    RedisHelpersModule,
    DriverModule,
    CommonCouponModule,
    TypeOrmModule.forFeature([
      RequestEntity,
      ServiceCategoryEntity,
      ServiceOptionEntity,
      ServiceEntity,
      RiderEntity,
      RiderWalletEntity,
      RiderTransactionEntity,
      DriverEntity,
      DriverWalletEntity,
      DriverTransactionEntity,
      ProviderWalletEntity,
      ProviderTransactionEntity,
      FleetEntity,
      FleetWalletEntity,
      FleetTransactionEntity
    ]),
    RegionModule,
    FirebaseNotificationModule.register(),
    GoogleServicesModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([RequestEntity, RiderEntity, RequestActivityEntity]),
      ],
      pubSub: RedisPubSubProvider.provider(),
      dtos: [{ DTOClass: OrderDTO }],
      resolvers: [
        {
          DTOClass: RiderDTO,
          EntityClass: RiderEntity,
          read: { disabled: true },
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true }
        }
      ]
    }),
  ],
  providers: [
    OrderSubscriptionService,
    SharedOrderService,
    DriverOrderQueryService,
    OrderResolver,
    OrderService,
    ServiceService,
    SharedRiderService,
    SharedDriverService,
    SharedProviderService,
    SharedFleetService,
    RedisPubSubProvider.provider(),
    CronJobService,
  ],
  exports: [
    DriverOrderQueryService
  ]
})
export class OrderModule {}
