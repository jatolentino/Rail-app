import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { RoleGQL, RoleQuery } from '@rail/admin-panel/generated/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class RoleViewResolver implements Resolve<ApolloQueryResult<RoleQuery>> {
  constructor(
    private gql: RoleGQL
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApolloQueryResult<RoleQuery>> {
    return this.gql.fetch({id: route.params.id});
  }
}
