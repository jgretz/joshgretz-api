import {Module} from '@nestjs/common';
import {StravaAccessController} from './controllers/strava/access';
import {UpdateUserStravaAccessDetailsService} from './services/update_user_strava_access_details.service';
import {DrizzleService} from 'src/db/services/db.service';
import {StravaActivitiesController} from './controllers/strava/activities';
import {GetStravaActivitiesForUserService} from './services/strava/get_strava_activities_for_user.service';
import {GetFromStravaService} from './services/strava/get_from_strava.service';
import {GetStravaAthleteForUserService} from './services/strava/get_strava_athlete_for_user.service';
import {GetGearDetailsService} from './services/strava/get_gear_details.service';
import {UpdateActivitiesForStravaUserService} from './services/update_user_activities.service';
import {GetGearForUserService} from './services/strava/get_gear_for_user.service';
import {GetOldestKnownActivitityForUserService} from './services/strava/get_last_known_activity_for_user.service';

@Module({
  controllers: [StravaAccessController, StravaActivitiesController],
  providers: [
    DrizzleService,

    GetFromStravaService,
    GetStravaAthleteForUserService,
    GetGearDetailsService,
    GetGearForUserService,
    GetStravaActivitiesForUserService,
    GetOldestKnownActivitityForUserService,

    UpdateUserStravaAccessDetailsService,
    UpdateActivitiesForStravaUserService,
  ],
})
export class RunningModule {}
