import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { DriverStatus } from '@rail/database/enums/driver-status.enum';
import { Gender } from '@rail/database/enums/gender.enum';

@InputType()
export class UpdateDriverInput {
    firstName?: string;
    lastName?: string;
    status?: DriverStatus;
    certificateNumber?: string;
    email?: string;
    @Field(() => Int)
    carProductionYear?: number;
    carPlate?: string;
    mediaId?: number;
    gender?: Gender;
    accountNumber?: string;
    bankName?: string;
    bankRoutingNumber?: string;
    bankSwift?: string;
    address?: string;
    @Field(() => ID)
    carModelId?: number;
    @Field(() => ID)
    carColorId?: number;
    notificationPlayerId?: string;
    @Field(() => Int)
    searchDistance?: number;
}