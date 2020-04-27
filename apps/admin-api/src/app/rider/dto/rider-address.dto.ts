import { FilterableField, IDField } from "@nestjs-query/query-graphql";
import { ID, ObjectType } from "@nestjs/graphql";
import { Point } from "@rail/database";
import { RiderAddressType } from "@rail/database/enums/rider-address-type.enum";

@ObjectType('RiderAddress')
export class RiderAddressDTO {
    @IDField(() => ID)
    id: number;
    type: RiderAddressType;
    title: string;
    details?: string;
    location: Point;
    @FilterableField(() => ID)
    riderId: number;
}