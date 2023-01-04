import { Publisher, StationCreatedEvent, Subjects } from '@phibase/common-v2';

export class StationCreatedPublisher extends Publisher<StationCreatedEvent> {
  subject: Subjects.StationCreated = Subjects.StationCreated;
}
