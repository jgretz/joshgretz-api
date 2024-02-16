import {Controller, Post, Body} from '@nestjs/common';
import {GetActivitiesForUserDto} from '../dto/get_activities_for_user';
import {UpdateActivitiesForStravaUserService} from '../../services/update_user_activities.service';

@Controller('running/strava/import_activities')
export class StravaActivitiesController {
  constructor(private service: UpdateActivitiesForStravaUserService) {}

  @Post()
  async find(@Body() updateDto: GetActivitiesForUserDto) {
    return this.service.update(updateDto.user_id);
  }
}
