import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCouponModule } from '@rail/coupon/common-coupon.module';

import { CouponEntity } from '@rail/database/coupon.entity';
import { RequestEntity } from '@rail/database/request.entity';
import { SharedOrderModule } from '@rail/order/shared-order.module';
import { OrderModule } from '../order/order.module';
import { CouponResolver } from './coupon.resolver';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    forwardRef(() => OrderModule),
      SharedOrderModule,
      CommonCouponModule,
      TypeOrmModule.forFeature([RequestEntity, CouponEntity]),
    // NestjsQueryGraphQLModule.forFeature({
    //   imports: [NestjsQueryTypeOrmModule.forFeature([CouponEntity])],
    //   resolvers: [
    //     {
    //       EntityClass: CouponEntity,
    //       DTOClass: CouponDTO,
    //       create: { disabled: true },
    //       read: { disabled: true },
    //       delete: { disabled: true },
    //       update: { disabled: true },
    //       guards: [GqlAuthGuard],
    //       pagingStrategy: PagingStrategies.NONE,
    //     },
    //   ],
    // }),
  ],
  providers: [CouponService, CouponResolver],
  exports: [CouponService]
})
export class CouponModule {}
