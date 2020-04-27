import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { Point } from "@rail/database";

@InputType()
export class CreateOrderInput {
    @Field(() => ID)
    riderId: number;
    @Field(() => ID)
    serviceId!: number;
    points!: Point[];
    addresses!: string[];
    @Field(() => Int)
    intervalMinutes!: number;
}