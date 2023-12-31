import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { ServicesListGQL, ServicesListQuery } from '@rail/admin-panel/generated/graphql';
import { TableService } from '@rail/admin-panel/src/app/@services/table-service';
import { Observable } from 'rxjs';

@Injectable()
export class ServicesListResolver implements Resolve<ApolloQueryResult<ServicesListQuery>> {
  constructor(
    private paging: TableService,
    private gql: ServicesListGQL
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApolloQueryResult<ServicesListQuery>> {
    return this.gql.fetch();
  }
}
