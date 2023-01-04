import { Publisher, HardwareDeletedEvent, Subjects } from '@phibase/common-v2';

export class HardwareDeletedPublisher extends Publisher<HardwareDeletedEvent> {
  subject: Subjects.HardwareDeleted = Subjects.HardwareDeleted;
}
