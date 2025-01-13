export type HomeCollectionStatus = 'pending' | 'call_done' | 'follow_up' | 'deal_closed' | 'not_interested';

export interface HomeCollectionRequest {
  id: string;
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  pinCode: string;
  preferredDate: string;
  preferredTime: string;
  status: HomeCollectionStatus;
  createdAt: string;
  updatedAt: string;
}
