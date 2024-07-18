import { Model, Schema, Types, model } from "mongoose";

export interface IAntragAnlage2 {
    id?: string;
    themenvorschlag?: string;
    betreuung1?: string;
    akademischerGradVonBetreuung1?: string;
    betreuung2?: string;
    akademischerGradVonBetreuung2?: string;
    arbeitAlsGruppenarbeit?: boolean;
    gruppenmitglied1?: string;
    matrikelnummerVonGruppenmitglied1?: number;
    gruppenmitglied2?: string;
    matrikelnummerVonGruppenmitglied2?: number;
    studentenSindAnHochschule?: boolean;
    studentenSindBeiFirma?: boolean;
    startVorlesungszeit?: boolean;
    startZum?: Date;
    begruendungFuerDatum?: string;
    creator?: string;
}

type AntragAnlage2Model = Model<IAntragAnlage2>;

const AntragAnlage2Schema = new Schema<IAntragAnlage2>({
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    themenvorschlag: { type: String, required: true },
    betreuung1: { type: String, required: true },
    akademischerGradVonBetreuung1: { type: String, required: true },
    betreuung2: { type: String },
    akademischerGradVonBetreuung2: { type: String },
    arbeitAlsGruppenarbeit: { type: Boolean, required: true },
    gruppenmitglied1: { type: String },
    matrikelnummerVonGruppenmitglied1: { type: Number },
    gruppenmitglied2: { type: String },
    matrikelnummerVonGruppenmitglied2: { type: Number },
    studentenSindAnHochschule: { type: Boolean, required: true },
    studentenSindBeiFirma: { type: Boolean, required: true },
    startVorlesungszeit: { type: Boolean, required: true },
    startZum: { type: Date },
    begruendungFuerDatum: { type: String },
}, {
    timestamps: true
});

export const AntragAnlage2 = model<IAntragAnlage2, AntragAnlage2Model>("AntragAnlage2", AntragAnlage2Schema);
