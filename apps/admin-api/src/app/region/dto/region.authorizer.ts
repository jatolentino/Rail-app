import { Filter } from "@nestjs-query/core";
import { CustomAuthorizer, AuthorizationContext } from "@nestjs-query/query-graphql";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { OperatorPermission } from "@rail/database/enums/operator-permission.enum";
import { OperatorEntity } from "@rail/database/operator.entity";
import { getRepository } from "typeorm";
import { UserContext } from "../../auth/authenticated-admin";

@Injectable()
export class RegionAuthorizer implements CustomAuthorizer<any> {
    
    async authorize(context: UserContext, authorizerContext: AuthorizationContext): Promise<Filter<any>> {
        const operator = await getRepository(OperatorEntity).findOne(context.req.user.id, { relations: ['role'] });
        if (authorizerContext.readonly && !operator.role.permissions.includes(OperatorPermission.Regions_View)) {
            throw new UnauthorizedException();
        }
        if(!authorizerContext.readonly && !operator.role.permissions.includes(OperatorPermission.Regions_Edit)) {
            throw new UnauthorizedException();
        }
        return undefined;
    }
}