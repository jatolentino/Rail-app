import { Field, ID, InputType } from '@nestjs/graphql';
import { ProviderDeductTransactionType } from '@rail/database/enums/provider-deduct-transaction-type.enum';
import { ProviderRechargeTransactionType } from '@rail/database/enums/provider-recharge-transaction-type.enum';
import { TransactionAction } from '@rail/database/enums/transaction-action.enum';

@InputType()
export class FleetTransactionInput {
    action: TransactionAction;
    deductType?: ProviderDeductTransactionType;
    rechargeType?: ProviderRechargeTransactionType;
    amount: number;
    currency: string;
    refrenceNumber?: string;
    @Field(() => ID)
    fleetId!: number;
    description?: string;
}