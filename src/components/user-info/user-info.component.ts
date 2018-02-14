import { Component, Input } from '@angular/core';

import { User } from 'models/app-models';

@Component({
  selector: 'wlm-user-info',
  templateUrl: 'user-info.component.html'
})
export class UserInfoComponent {

  @Input() user: User;

  constructor() {

  }

}
