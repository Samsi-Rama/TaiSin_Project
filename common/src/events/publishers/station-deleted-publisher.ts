import { Publisher, StationDeletedEvent, Subjects } from '@phibase/common-v2';

export class StationDeletedPublisher extends Publisher<StationDeletedEvent> {
  subject: Subjects.StationDeleted= Subjects.StationDeleted;
}
