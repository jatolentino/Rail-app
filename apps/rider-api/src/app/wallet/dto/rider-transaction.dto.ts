import { Authorize, FilterableField, IDField } from '@nestjs-query/query-graphql';
import { Field, GraphQLTimestamp, ID, ObjectType } from '@nestjs/graphql';
import { RiderDeductTransactionType } from '@rail/database/enums/rider-deduct-transaction-type.enum';
import { RiderRechargeTransactionType } from '@rail/database/enums/rider-recharge-transaction-type.enum';
import { TransactionAction } from '@rail/database/enums/transaction-action.enum';

import { UserContext } from '../../auth/authenticated-user';

@ObjectType("RiderTransacion")
@Authorize({
    authorize: (context: UserContext) => ({riderId: {eq: context.req.user.id}})
})
export class RiderTransactionDTO {
    @IDField(() => ID)
    id: number;
    @Field(() => GraphQLTimestamp)
    createdAt: number;
    action: TransactionAction;
    deductType?: RiderDeductTransactionType;
    rechargeType?: RiderRechargeTransactionType;
    amount!: number;
    currency: string;
    refrenceNumber?: string;
    @FilterableField(() => ID, { filterOnly: true })
    riderId: number;
}