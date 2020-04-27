import { InjectPubSub } from '@nestjs-query/query-graphql';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from '@rail/database';
import { DriverStatus } from '@rail/database/enums/driver-status.enum';
import { OrderStatus } from '@rail/database/enums/order-status.enum';
import { RequestActivityType } from '@rail/database/enums/request-activity-type.enum';
import { RequestActivityEntity } from '@rail/database/request-activity.entity';
import { RequestEntity } from '@rail/database/request.entity';
import { SharedDriverService } from '@rail/order/shared-driver.service';
import { SharedFleetService } from '@rail/order/shared-fleet.service';
import { OrderRedisService } from '@rail/redis/order-redis.service';
import { ForbiddenError } from 'apollo-server-core';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { In, Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(RequestEntity)
        public orderRepository: Repository<RequestEntity>,
        @InjectRepository(RequestActivityEntity)
        public activityRepository: Repository<RequestActivityEntity>,
        private driverService: SharedDriverService,
        private orderRedisService: OrderRedisService,
        private sharedFleetService: SharedFleetService,
        @InjectPubSub()
        private pubSub: RedisPubSub,
    ) { }

    async cancelOrder(orderId: number): Promise<RequestEntity> {
        let order = await this.orderRepository.findOne(orderId);
        const allowedStatuses = [OrderStatus.DriverAccepted, OrderStatus.Arrived];
        if (order == null || !allowedStatuses.includes(order.status)) {
            throw new ForbiddenError("It is not allowed to cancel this order");
        }
        await this.orderRepository.update(order.id, { status: OrderStatus.DriverCanceled, finishTimestamp: new Date(), costAfterCoupon: 0 });
        order = await this.orderRepository.findOne(order.id);
        this.driverService.updateDriverStatus(order.driverId, DriverStatus.Online);
        this.pubSub.publish('orderUpdated', { orderUpdated: order });
        return order;
    }

    async expireOrders(orderIds: number[]) {
        this.orderRedisService.expire(orderIds);
        this.orderRepository.update(orderIds, { status: OrderStatus.Expired });
        for (const requestId of orderIds) {
            this.activityRepository.insert({
                requestId,
                type: RequestActivityType.Expired
            });
        }
    }

    async getOrdersForDriver(driverId: number): Promise<RequestEntity[]> {
        const driver = await this.driverService.driverRepo.findOne(driverId, { relations: ['enabledServices'] });
        const orderIds = await this.orderRedisService.getForDriver(driverId, driver.searchDistance);
        let orders = await this.orderRepository.find({
            where: {
                id: In(orderIds), serviceId: In(driver.enabledServices.map(service => service.id))
            },
            relations: ['service']
        });
        for(let order of orders) {
            const fleetIds = await this.sharedFleetService.getFleetIdsInPoint(order.points[0]);
            if(fleetIds.length > 0 && (!fleetIds.includes(driver.fleetId) || driver.fleetId == null)) {
                orders = orders.filter(_order => _order.id != order.id);
            }
        }
        Logger.log(`found ${JSON.stringify(orders)}`);

        return orders;
    }
}