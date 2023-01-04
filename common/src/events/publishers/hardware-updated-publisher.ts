import { Publisher, HardwareUpdatedEvent, Subjects } from '@phibase/common-v2';

export class HardwareUpdatedPublisher extends Publisher<HardwareUpdatedEvent> {
  subject: Subjects.HardwareUpdated = Subjects.HardwareUpdated;
}
