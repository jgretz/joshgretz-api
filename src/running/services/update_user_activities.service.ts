import {Injectable} from '@nestjs/common';
import {DrizzleService} from 'src/db/services/db.service';
import {GetStravaActivitiesForUserService} from './strava/get_strava_activities_for_user.service';
import {eq} from 'drizzle-orm';
import {stravaActivities} from 'src/db/schema';
import {convertStravaApiActivityToModel} from './converters/convert_strava_api_activity_to_model';
import {lookupLocationByLatLng} from './utility/lookup_location_by_lat_lng';
import {GetOldestKnownActivitityForUserService} from './strava/get_last_activity_for_user.service';

@Injectable()
export class UpdateActivitiesForStravaUserService {
  constructor(
    private drizzle: DrizzleService,
    private getNextActivities: GetStravaActivitiesForUserService,
    private getOldestActivity: GetOldestKnownActivitityForUserService,
  ) {}

  async update(user_id: number) {
    const oldestKnowActivity = await this.getOldestActivity.get(user_id);
    const oldestDate = oldestKnowActivity ? new Date(oldestKnowActivity.start_date) : new Date();

    const stravaActivityList = await this.getNextActivities.get(user_id, 100, oldestDate);

    const values = (
      await Promise.all(
        stravaActivityList.map(async (stravaActivity) => {
          const activity = await this.drizzle.db.query.stravaActivities.findFirst({
            where: eq(stravaActivities.strava_id, stravaActivity.id.toString()),
          });

          if (activity) {
            return null;
          }

          if (!stravaActivity.location_city) {
            const lookup = await lookupLocationByLatLng(
              this.drizzle,
              stravaActivity.start_latlng[0],
              stravaActivity.start_latlng[1],
            );

            if (lookup) {
              stravaActivity.location_city = lookup.location_city;
              stravaActivity.location_state = lookup.location_state;
              stravaActivity.location_country = lookup.location_country;
            }
          }

          return stravaActivity;
        }),
      )
    )
      .filter((activity) => activity !== null)
      .map((stravaActivity) => {
        return convertStravaApiActivityToModel(stravaActivity, user_id);
      });

    if (values.length === 0) {
      console.log('No new activities found');
      return [];
    }

    console.log(`Inserting ${values.length} new activities`);

    return await this.drizzle.db.insert(stravaActivities).values(values);
  }
}
