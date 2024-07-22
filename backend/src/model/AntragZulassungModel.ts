import { Model, Schema, Types, model } from "mongoose";

// UserData schema for the UserData of the applicant
export interface IUserDetails {
  lastName: string; // Required | Nachname
  firstName: string; // Required | Vorname
  street: string; // Straße
  city: string; // Stadt
  postalCode: string; // Postleitzahl
  country: string; // Land
  phone: string; // Required | Telefon
}

// Schema for the UserData
const UserDetailsSchema = new Schema<IUserDetails>({
  lastName: { type: String, required: false }, // Nachname
  firstName: { type: String, required: false }, // Vorname
  street: { type: String, required: false }, // Straße
  city: { type: String, required: false }, // Stadt
  postalCode: { type: String, required: false }, // Postleitzahl
  country: { type: String, required: false }, // Land
  phone: { type: String, required: false }, // Telefon
});

// Interface for the application model
export interface IApplication {
  id?: string;
  creator?: string;
  studentid?: string; // Required | Matrikelnummer
  department?: string; // Required | Fachbereich
  bachelor?: boolean; // Required | Bachelor
  master?: boolean; // Required | Master
  userDetails?: IUserDetails; // Required | Benutzerdaten
  internshipCompleted?: boolean; // Required | Praxisphase abgeschlossen
  recognitionApplied?: boolean; // Required | Anerkennung beantragt
  internshipCompletedFrom?: Date; // Required | Praxisphase abgeleistet von
  internshipCompletedTo?: Date; // Required | Praxisphase abgeleistet bis
  modulesCompleted?: boolean; // Required | Module abgeschlossen
  modulesPending?: boolean; // Required | Module ausstehend
  attachment2Included?: boolean; // Required | Anlage 2 beigefügt
  topicSuggestion?: boolean; // Required | Thema vorgeschlagen
  date?: Date; // Required | Datum
}

// Type for the application model
type ApplicationModel = Model<IApplication>;

// Schema for the application model
const ApplicationSchema = new Schema<IApplication>({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Ersteller
  studentid: { type: String, required: false }, // Matrikelnummer
  department: { type: String, required: false }, // Fachbereich
  bachelor: { type: Boolean, required: false }, // Bachelor
  master: { type: Boolean, required: false }, // Master
  userDetails: { type: UserDetailsSchema, required: false }, // Benutzerdaten
  internshipCompleted: { type: Boolean, required: false, default: false }, // Praxisphase abgeschlossen
  recognitionApplied: { type: Boolean, required: false, default: false }, // Anerkennung beantragt
  internshipCompletedFrom: { type: Date, required: false }, // Praxisphase abgeleistet von
  internshipCompletedTo: { type: Date, required: false }, // Praxisphase abgeleistet bis
  modulesCompleted: { type: Boolean, required: false, default: false }, // Module abgeschlossen
  modulesPending: { type: Boolean, required: false, default: false }, // Module ausstehend
  attachment2Included: { type: Boolean, required: false, default: false }, // Anlage 2 beigefügt
  topicSuggestion: { type: Boolean, required: false, default: false }, // Thema vorgeschlagen
  date: { type: Date, required: false }, // Datum
},{
  timestamps: true,
});

// Model for the application for admission
export const Application = model<IApplication, ApplicationModel>("Application", ApplicationSchema);
