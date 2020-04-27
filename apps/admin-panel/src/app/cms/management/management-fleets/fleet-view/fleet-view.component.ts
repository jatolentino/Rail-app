import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagColorService } from '@rail/admin-panel/src/app/@services/tag-color/tag-color.service';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { ViewFleetQuery } from '@rail/admin-panel/generated/graphql';

@Component({
  selector: 'app-fleet-view',
  templateUrl: './fleet-view.component.html'
})
export class FleetViewComponent implements OnInit {
  tagColor: TagColorService;
  query?: Observable<ApolloQueryResult<ViewFleetQuery>>;

  constructor(private route: ActivatedRoute, private _tagColor: TagColorService, private translation: TranslateService) {
    this.tagColor = _tagColor;
  }

  ngOnInit(): void {
    this.query = this.route.data.pipe(map(data => data.fleet));
  }
}
