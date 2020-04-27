import { NestjsQueryGraphQLModule, PagingStrategies } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisPubSubProvider } from '@rail/database';
import { CarColorEntity } from '@rail/database/car-color.entity';
import { CarModelEntity } from '@rail/database/car-model.entity';
import { DriverTransactionEntity } from '@rail/database/driver-transaction.entity';
import { DriverWalletEntity } from '@rail/database/driver-wallet.entity';
import { DriverEntity } from '@rail/database/driver.entity';
import { RequestEntity } from '@rail/database/request.entity';
import { ProviderTransactionEntity } from '@rail/database/provider-transaction.entity';
import { ProviderWalletEntity } from '@rail/database/provider-wallet.entity';
import { RegionEntity } from '@rail/database/region.entity';
import { ServiceCategoryEntity } from '@rail/database/service-category.entity';
import { SharedDriverService } from '@rail/order/shared-driver.service';
import { DriverNotificationService } from '@rail/order/firebase-notification-service/driver-notification.service';
import { GoogleServicesModule } from '@rail/order/google-services.module';
import { SharedProviderService } from '@rail/order/shared-provider.service';
import { RegionModule } from '@rail/order/region.module';
import { SharedOrderService } from '@rail/order/shared-order.service';
import { RedisHelpersModule } from '@rail/redis/redis-helper.module';

import { GqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { RiderModule } from '../rider/rider.module';
import { ServiceModule } from '../service/service.module';
import { CarColorDTO } from './dto/car-color.dto';
import { CarModelDTO } from './dto/car-model.dto';
import { DriverDTO } from './dto/driver.dto';
import { OrderDTO } from './dto/order.dto';
import { OrderResolver } from './order.resolver';
import { RiderOrderService } from './rider-order.service';
import { FeedbackEntity } from '@rail/database/feedback.entity';
import { OrderSubscriptionService } from './order-subscription.service';
import { MediaEntity } from '@rail/database/media.entity';
import { RequestActivityEntity } from '@rail/database/request-activity.entity';
import { SharedOrderModule } from '@rail/order/shared-order.module';
import { RiderNotificationService } from '@rail/order/firebase-notification-service/rider-notification.service';
import { CouponModule } from '../coupon/coupon.module';
import { FeedbackParameterEntity } from '@rail/database/feedback-parameter.entity';
import { FeedbackParameterDTO } from './dto/feedback-parameter.dto';
import { ServiceOptionEntity } from '@rail/database/service-option.entity';
import { UpdateOrderInput } from './dto/update-order.input';
import { RiderOrderQueryService } from './rider-order.query-service';
import { OrderRedisService } from '@rail/redis/order-redis.service';
import { CommonCouponModule } from "@rail/coupon/common-coupon.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      ProviderWalletEntity,
      ProviderTransactionEntity,
      DriverEntity,
      DriverWalletEntity,
      DriverTransactionEntity,
      FeedbackEntity,
      RequestActivityEntity,
      FeedbackParameterEntity,
      ServiceOptionEntity
    ]),
    CommonCouponModule,
    GoogleServicesModule,
    ServiceModule,
    RiderModule,
    RegionModule,
    forwardRef(() => CouponModule),
    RedisHelpersModule,
    SharedOrderModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          RequestEntity,
          DriverEntity,
          CarColorEntity,
          CarModelEntity,
          RegionEntity,
          ServiceCategoryEntity,
          MediaEntity,
          FeedbackParameterEntity,
          RequestActivityEntity,
          FeedbackEntity
        ]),
        CommonCouponModule,
        SharedOrderModule
      ],
      pubSub: RedisPubSubProvider.provider(),
      services: [RiderOrderQueryService, RiderOrderService, OrderRedisService, DriverNotificationService],
      resolvers: [
        {
          EntityClass: RequestEntity,
          DTOClass: OrderDTO,
          UpdateDTOClass: UpdateOrderInput,
          ServiceClass: RiderOrderQueryService,
          //Service: RiderOrderQueryService,
          create: { disabled: true },
          update: { many: { disabled: true } },
          delete: { disabled: true },
          guards: [GqlAuthGuard]
        },
        {
          EntityClass: DriverEntity,
          DTOClass: DriverDTO,
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          read: { disabled: true },
        },
        {
          EntityClass: CarModelEntity,
          DTOClass: CarModelDTO,
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          read: { disabled: true },
        },
        {
          EntityClass: CarColorEntity,
          DTOClass: CarColorDTO,
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          read: { disabled: true },
        },
        {
          EntityClass: FeedbackParameterEntity,
          DTOClass: FeedbackParameterDTO,
          pagingStrategy: PagingStrategies.NONE,
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          read: { one: { disabled: true } },
        }
      ],
    }),
  ],
  providers: [
    OrderSubscriptionService,
    SharedProviderService,
    OrderResolver,
    SharedOrderService,
    RiderOrderService,
    SharedDriverService,
    DriverNotificationService,
    RiderNotificationService,
    RedisPubSubProvider.provider(),
  ],
  exports: [RiderOrderService]
})
export class OrderModule {}
