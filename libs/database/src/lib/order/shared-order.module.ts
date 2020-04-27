import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCouponModule } from '@rail/coupon/common-coupon.module';
import { RedisPubSubProvider } from '@rail/database';
import { DriverTransactionEntity } from '@rail/database/driver-transaction.entity';
import { DriverWalletEntity } from '@rail/database/driver-wallet.entity';
import { DriverEntity } from '@rail/database/driver.entity';
import { FleetTransactionEntity } from '@rail/database/fleet-transaction.entity';
import { FleetWalletEntity } from '@rail/database/fleet-wallet.entity';
import { FleetEntity } from '@rail/database/fleet.entity';
import { ProviderTransactionEntity } from '@rail/database/provider-transaction.entity';
import { ProviderWalletEntity } from '@rail/database/provider-wallet.entity';
import { RequestActivityEntity } from '@rail/database/request-activity.entity';
import { RequestEntity } from '@rail/database/request.entity';
import { RiderEntity } from '@rail/database/rider-entity';
import { RiderTransactionEntity } from '@rail/database/rider-transaction.entity';
import { RiderWalletEntity } from '@rail/database/rider-wallet.entity';
import { ServiceCategoryEntity } from '@rail/database/service-category.entity';
import { ServiceOptionEntity } from '@rail/database/service-option.entity';
import { ServiceEntity } from '@rail/database/service.entity';
import { RedisHelpersModule } from '@rail/redis/redis-helper.module';
import { SharedConfigurationService } from '../shared-configuration.service';
import { FirebaseNotificationModule } from './firebase-notification-service/firebase-notification-service.module';
import { GoogleServicesModule } from './google-services/google-services.module';
import { RegionModule } from './region/region.module';
import { ServiceService } from './service.service';
import { SharedDriverService } from './shared-driver.service';
import { SharedFleetService } from './shared-fleet.service';
import { SharedOrderService } from './shared-order.service';
import { SharedProviderService } from './shared-provider.service';
import { SharedRiderService } from './shared-rider.service';

@Module({
  imports: [
      RedisHelpersModule,
      CommonCouponModule,
    TypeOrmModule.forFeature([
      ServiceCategoryEntity,
      ServiceOptionEntity,
      ServiceEntity,
      RiderEntity,
      DriverEntity,
      DriverWalletEntity,
      DriverTransactionEntity,
      FleetEntity,
      FleetWalletEntity,
      FleetTransactionEntity,
      ProviderWalletEntity,
      ProviderTransactionEntity,
      RiderWalletEntity,
      RiderTransactionEntity,
      RequestEntity,
      RequestActivityEntity,
      
    ]),
    RegionModule,
    GoogleServicesModule,
    FirebaseNotificationModule.register(),
  ],
  providers: [
    RedisPubSubProvider.provider(),
    ServiceService,
    SharedDriverService,
    SharedFleetService,
    SharedOrderService,
    SharedProviderService,
    SharedRiderService,
    SharedConfigurationService
  ],
  exports: [
    SharedDriverService,
    SharedFleetService,
    SharedOrderService,
    SharedProviderService,
    SharedRiderService,
  ],
})
export class SharedOrderModule {}
