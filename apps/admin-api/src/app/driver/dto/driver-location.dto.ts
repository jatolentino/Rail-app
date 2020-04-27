import { ObjectType } from "@nestjs/graphql";
import { Point } from "@rail/database";
import { DriverStatus } from "@rail/database/enums/driver-status.enum";
import { Gender } from "@rail/database/enums/gender.enum";

@ObjectType()
export class OnlineDriver {
    location: Point;
    driverId: number;
    lastUpdatedAt: number;
}

@ObjectType()
export class OnlineDriverWithData {
    id: number;
    location: Point;
    lastUpdatedAt: number;
    firstName?: string;
    lastName?: string;
    mobileNumber: string;
    status: DriverStatus;
    gender?: Gender;
    rating?: number;
    reviewCount: number;
}