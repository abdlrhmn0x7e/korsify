export interface SettingsFormValues {
  name: string;
  email: string;
  phone: string;
  branding: {
    logoStorageId?: string;
    coverStorageId?: string;
    primaryColor?: string;
  };
  paymentInfo: {
    vodafoneCash?: string;
    instaPay?: string;
    instructions?: string;
  };
  subdomain: string;
}
