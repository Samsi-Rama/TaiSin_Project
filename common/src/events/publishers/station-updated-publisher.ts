import { Publisher, StationUpdatedEvent, Subjects } from '@phibase/common-v2';

export class StationUpdatedPublisher extends Publisher<StationUpdatedEvent> {
  subject: Subjects.StationUpdated = Subjects.StationUpdated;
}
