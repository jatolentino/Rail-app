import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CouponEntity } from "@rail/database/coupon.entity";
import { RiderRechargeTransactionType } from "@rail/database/enums/rider-recharge-transaction-type.enum";
import { TransactionAction } from "@rail/database/enums/transaction-action.enum";
import { TransactionStatus } from "@rail/database/enums/transaction-status.enum";
import { GiftCardEntity } from "@rail/database/gift-card.entity";
import { RequestEntity } from "@rail/database/request.entity";
import { SharedOrderService } from "@rail/order/shared-order.service";
import { SharedRiderService } from "@rail/order/shared-rider.service";
import { ForbiddenError } from "apollo-server-core";
import { Repository } from "typeorm";
import { RiderWalletDTO } from "../wallet/dto/rider-wallet.dto";

@Injectable()
export class CouponService {
    constructor(
        @InjectRepository(CouponEntity)
        private giftCardRepo: Repository<GiftCardEntity>,
        private sharedRiderService: SharedRiderService
    ) { }

    

    async redeemGiftCard(code: string, riderId: number): Promise<RiderWalletDTO> {
        const card = await this.giftCardRepo.findOne({ code });
        if (card == null) throw new ForbiddenError('Invalid code');
        await this.giftCardRepo.update(card.id, { isUsed: true });
        return this.sharedRiderService.rechargeWallet({
            riderId,
            action: TransactionAction.Recharge,
            rechargeType: RiderRechargeTransactionType.Gift,
            status: TransactionStatus.Done,
            currency: card.currency,
            amount: card.amount,
            giftCardId: card.id
        });
    }
}