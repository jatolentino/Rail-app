import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateCouponGQL, UpdateCouponGQL } from '@rail/admin-panel/generated/graphql';
import { RouterHelperService } from '@rail/admin-panel/src/app/@services/router-helper.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-coupon-view',
  templateUrl: './coupon-view.component.html',
  styles: [
    'nz-input-number{ @apply w-full }',
  ]
})
export class CouponViewComponent implements OnInit {
  form = this.fb.group({
    id: [null],
    code: [null, Validators.required],
    title: [null, Validators.required],
    description: [null, Validators.required],
    manyUsersCanUse: [0, Validators.required],
    manyTimesUserCanUse: [0, Validators.required],
    minimumCost: [0, Validators.required],
    maximumCost: [0, Validators.required],
    dates: [null, Validators.required],
    discountPercent: [0, Validators.required],
    discountFlat: [0, Validators.required],
    creditGift: [0, Validators.required],
    isEnabled: [true, Validators.required],
    isFirstTravelOnly: [false, Validators.required]
  });

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private fb: UntypedFormBuilder,
    private routerHelper: RouterHelperService,
    private createGQL: CreateCouponGQL,
    private updateGQL: UpdateCouponGQL) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => (data.coupon != null ? this.form.patchValue(data.coupon.data.coupon) : null));
  }

  async onSubmit() {
    const {id, dates, ..._input} = this.form.value;
    const startAt = dates[0].getTime();
    const expireAt = dates[1].getTime();
    const input = {..._input, startAt, expireAt};
    if(id == null) {
      await firstValueFrom(this.createGQL.mutate({input}));
    } else {
      await firstValueFrom(this.updateGQL.mutate({id, input}));
    }
    this.routerHelper.goToParent(this.route);
  }
}
