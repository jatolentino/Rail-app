import { NestjsQueryGraphQLModule, PagingStrategies } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { FleetTransactionEntity } from '@rail/database/fleet-transaction.entity';
import { FleetWalletEntity } from '@rail/database/fleet-wallet.entity';
import { FleetEntity } from '@rail/database/fleet.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FleetTransactionDTO } from './dto/fleet-transaction.dto';
import { FleetWalletDTO } from './dto/fleet-wallet.dto';
import { FleetDTO } from './dto/fleet.dto';
import { FleetResolver } from './fleet.resolver';

@Module({
    imports: [NestjsQueryGraphQLModule.forFeature({
        imports: [NestjsQueryTypeOrmModule.forFeature([FleetEntity, FleetTransactionEntity, FleetWalletEntity])],
        resolvers: [
            {
                EntityClass: FleetEntity,
                DTOClass: FleetDTO,
                read: { many: { disabled: true } },
                create: { disabled: true },
                update: { disabled: true },
                delete: { disabled: true },
                pagingStrategy: PagingStrategies.OFFSET,
                enableTotalCount: true,
                guards: [JwtAuthGuard]
            },
            {
                EntityClass: FleetWalletEntity,
                DTOClass: FleetWalletDTO,
                create: { disabled: true },
                update: { disabled: true },
                delete: { disabled: true },
                pagingStrategy: PagingStrategies.OFFSET,
                enableTotalCount: true,
                guards: [JwtAuthGuard]
            },
            {
                EntityClass: FleetTransactionEntity,
                DTOClass: FleetTransactionDTO,
                create: { disabled: true },
                update: { disabled: true },
                delete: { disabled: true },
                pagingStrategy: PagingStrategies.OFFSET,
                enableTotalCount: true,
                guards: [JwtAuthGuard]
            }
        ]
    })],
    providers: [FleetResolver]
})
export class FleetModule { }
