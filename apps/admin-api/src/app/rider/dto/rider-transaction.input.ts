import { Field, ID, InputType } from "@nestjs/graphql";
import { RiderDeductTransactionType } from "@rail/database/enums/rider-deduct-transaction-type.enum";
import { RiderRechargeTransactionType } from "@rail/database/enums/rider-recharge-transaction-type.enum";
import { TransactionAction } from "@rail/database/enums/transaction-action.enum";

@InputType()
export class RiderTransactionInput {
    action: TransactionAction;
    deductType?: RiderDeductTransactionType;
    rechargeType?: RiderRechargeTransactionType;
    amount: number;
    currency: string;
    refrenceNumber?: string;
    description?: string;
    @Field(() => ID)
    riderId!: number;
}