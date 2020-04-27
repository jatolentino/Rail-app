import { InputType } from "@nestjs/graphql";
import { Point } from "@rail/database";

@InputType()
export class CalculateFareInput {
    points!: Point[];
}