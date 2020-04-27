import { FilterableField, IDField, Relation } from "@nestjs-query/query-graphql";
import { ID, ObjectType } from "@nestjs/graphql";
import { ComplaintActivityType } from "@rail/database/enums/complaint-activity-type.enum";
import { OperatorDTO } from "../../operator/dto/operator.dto";

@ObjectType('ComplaintActivity')
@Relation('actor', () => OperatorDTO)
@Relation('assignedTo', () => OperatorDTO, { nullable: true })
export class ComplaintActivityDTO {
    @IDField(() => ID)
    id!: number;
    type: ComplaintActivityType;
    comment?: string;
    @FilterableField(() => ID)
    complaintId: number;
    
}