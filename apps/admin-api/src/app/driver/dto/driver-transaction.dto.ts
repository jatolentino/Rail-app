import { FilterableField, Relation } from "@nestjs-query/query-graphql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { DriverDeductTransactionType } from "@rail/database/enums/driver-deduct-transaction-type.enum";
import { DriverRechargeTransactionType } from "@rail/database/enums/driver-recharge-transaction-type.enum";
import { TransactionAction } from "@rail/database/enums/transaction-action.enum";
import { TransactionStatus } from "@rail/database/enums/transaction-status.enum";
import { OperatorDTO } from "../../operator/dto/operator.dto";

@ObjectType('DriverTransaction')
@Relation('operator', () => OperatorDTO, { nullable: true })
export class DriverTransactionDTO {
    @FilterableField()
    createdAt: Date;
    action: TransactionAction;
    status: TransactionStatus;
    deductType?: DriverDeductTransactionType;
    rechargeType?: DriverRechargeTransactionType;
    amount: number;
    currency: string;
    refrenceNumber?: string;
    @FilterableField(() => ID)
    driverId!: number;
    paymentGatewayId?: number;
    @Field(() => ID)
    operatorId?: number;
    requestId?: number;
    description?: string;
}