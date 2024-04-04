import { Types } from 'mongoose';

export type CreateMeetLinkType = {
  mentorId: string | Types.ObjectId;
  join_url: string;
};
