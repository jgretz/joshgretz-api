// https://www.strava.com/api/v3/athlete/activities?before=&after=&page=&per_page=" "Authorization: Bearer [[token]]"

import {Injectable} from '@nestjs/common';
import {StravaApiActivity} from '../../StravaApiTypes';
import {GetFromStravaService} from './get_from_strava.service';

@Injectable()
export class GetStravaActivitiesForUserService {
  constructor(private getFromStrava: GetFromStravaService) {}

  async get(user_id: number, count: number, before: Date) {
    const url = `https://www.strava.com/api/v3/athlete/activities?per_page=${count}&before=${before.getTime() / 1000}`;

    return await this.getFromStrava.get<StravaApiActivity[]>(url, user_id);
  }
}
