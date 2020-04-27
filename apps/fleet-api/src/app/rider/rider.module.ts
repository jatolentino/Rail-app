import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { RiderAddressEntity } from '@rail/database/rider-address.entity';
import { RiderEntity } from '@rail/database/rider-entity';
import { RiderTransactionEntity } from '@rail/database/rider-transaction.entity';
import { RiderWalletEntity } from '@rail/database/rider-wallet.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RiderDTO } from './dto/rider.dto';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([RiderEntity, RiderWalletEntity, RiderTransactionEntity, RiderAddressEntity])],
            resolvers: [
                {
                    EntityClass: RiderEntity,
                    DTOClass: RiderDTO,
                    read: { disabled: true },
                    create: { disabled: true },
                    update: { disabled: true },
                    delete: { disabled: true },
                    guards: [JwtAuthGuard]
                }
            ]
        })
    ]
})
export class RiderModule {}
