export interface OrphanageFormProps {
  // Contact person details
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonPosition: string;
  password: string;
  confirmPassword: string;

  // Basic orphanage details
  name: string;
  contactEmail: string;
  contactPhone: string;
}

export const orphanageDefaultFormValues: OrphanageFormProps = {
  // Contact person details
  contactPersonFirstName: "",
  contactPersonLastName: "",
  contactPersonEmail: "",
  contactPersonPhone: "",
  contactPersonPosition: "",
  password: "",
  confirmPassword: "",

  // Basic orphanage details
  name: "",
  contactEmail: "",
  contactPhone: "",
};
