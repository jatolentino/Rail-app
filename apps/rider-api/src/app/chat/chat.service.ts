import { QueryService } from '@nestjs-query/core';
import { InjectPubSub } from '@nestjs-query/query-graphql';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderMessageEntity } from '@rail/database/request-message.entity';
import { RequestEntity } from '@rail/database/request.entity';
import { DriverNotificationService } from '@rail/order/firebase-notification-service/driver-notification.service';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Repository } from 'typeorm';

import { OrderMessageDTO } from './dto/order-message.dto';
import { OrderMessageInput } from './dto/order-message.input';

@QueryService(OrderMessageEntity)
export class ChatService extends TypeOrmQueryService<OrderMessageEntity> {
    constructor(
        @InjectRepository(OrderMessageEntity)
        public repository: Repository<OrderMessageEntity>,
        @InjectRepository(RequestEntity)
        private requestRepository: Repository<RequestEntity>,
        @InjectPubSub()
        private pubSub: RedisPubSub,
        private driverNotificationService: DriverNotificationService
    ) {
        super(repository)
    }

    override async createOne(input: OrderMessageInput) {
        let message = await super.createOne({ ...input, sentByDriver: false });
        const order = await this.requestRepository.findOne(message.requestId, { relations: ['rider', 'driver'] });
        message = await this.getById(message.id);
        this.driverNotificationService.message(order.driver, message);
        this.pubSub.publish<{ newMessageReceived: OrderMessageDTO, driverId: number}>('newMessageForDriver', { newMessageReceived: message, driverId: order.driverId });
        return message;
    }
}