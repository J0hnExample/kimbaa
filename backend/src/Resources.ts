export type UserResource = {
    id?: string;
    name?: string;
    password?: string;
    admin?: boolean;
    studentId?: string;
    application?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    course?: string;
}
export type ModulResource = {
    id?: string;
    creator?: string;
    modulList?: string;
    modulnumber?: string;
    modulname?: string;
    creditPoints?: number;
    solved?: boolean;
    required?: boolean;
}

export type ModulListResource = {
    id?: string;
    creator?: string;
    studentId?: string;
    course?: string;
    datum?: string;
    updatedAt?: string;
}

export type userDetailsResource = {
    lastName?: string; // Nachname
    firstName?: string; // Vorname
    street?: string; // Straße
    city?: string; // Stadt
    postalCode?: string; // Postleitzahl
    country?: string; // Land
    phone?: string; // Telefon
  }
  
  export type ApplicationResource = {
    id?: string;
    creator?: string; // Ersteller
    attach1id?: string; // Anlage 1 ID
    attach2id?: string; // Anlage 2 ID
    studentid?: string; // Matrikelnummer
    department?: string; // Fachbereich
    bachelor?: boolean; // Bachelor
    master?: boolean; // Master
    userDetails?: userDetailsResource; // Benutzerdaten
    internshipCompleted?: boolean; // Praxisphase abgeschlossen
    recognitionApplied?: boolean; // Anerkennung beantragt
    internshipCompletedFrom?: Date; // Praxisphase abgeleistet von
    internshipCompletedTo?: Date; // Praxisphase abgeleistet bis
    modulesCompleted?: boolean; // Module abgeschlossen
    modulesPending?: boolean; // Module ausstehend
    attachment2Included?: boolean; // Anlage 2 beigefügt
    topicSuggestion?: boolean; // Thema vorgeschlagen
    sommersemester?: boolean; // Sommersemester
    wintersemester?: boolean; // Wintersemester
    date?: Date; // Datum
  }

export type applicationZulassungKontrollfragenResource = {
    dummy_frage: string;
    dummy_antwort: string;
}

export type LoginResource = {
    id: string
    role: "a"|"u"
    /** Expiration time in seconds since 1.1.1970 */
    exp: number
}

export type AntragAnlage2Resource = {
    id?: string;
    creator?: string;
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
}
