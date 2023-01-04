import { Publisher, HardwareCreatedEvent, Subjects } from '@phibase/common-v2';

export class HardwareCreatedPublisher extends Publisher<HardwareCreatedEvent> {
  subject: Subjects.HardwareCreated = Subjects.HardwareCreated;
}
