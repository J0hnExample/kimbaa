import { UserResource, AntragAnlage2Resource, ApplicationResource } from "./Resources";
import { User, IUser } from "./model/UserModel";
import { AntragAnlage2, IAntragAnlage2 } from "./model/AntragAnlage2Model";
import { Application, IApplication } from "./model/AntragZulassungModel";
import * as userService from "./services/UserService";
import * as antragAnlage2Service from "./services/AntragAnlage2Service";
import * as antragZulassungService from "./services/AntragZulassungService";
import { logger } from "./logger/testLogger";

export async function prefillDB(): Promise<{ user?: UserResource | IUser, AntragAnlage2?: AntragAnlage2Resource | IAntragAnlage2; application?: ApplicationResource | IApplication } | null> {
    await User.syncIndexes();
    await AntragAnlage2.syncIndexes();
    await Application.syncIndexes();

    // Check if user already exists
    const existUser: IUser | null = await User.findOne({ email: "hm5555@bht-berlin.de" }).exec();
    if (!existUser) {
        // Create Hans Maulwurf via service
        const user = await userService.createUser({
            name: "Hans Maulwurf",
            email: "hm5555@bht-berlin.de",
            studentId: "555555",
            password: "!12345Ab",
            course: "Medieninformatik"
        }) as UserResource;
        logger.info("Prefill User created: " + user);

        const antragAnlage2 = await antragAnlage2Service.createAntragAnlage2({
            creator: user.id!,
            themenvorschlag: "Vector eine Hügels mit Python berechnen",
            betreuung1: "Prof. Dr. Mümmelmann",
            akademischerGradVonBetreuung1: "Dr. rer. nat. nat. Phd",
            betreuung2: "Prof. Dr. Igeling",
            akademischerGradVonBetreuung2: "Dr. rer. nat.",
            arbeitAlsGruppenarbeit: true,
            gruppenmitglied1: "Petra Breitfrosch",
            matrikelnummerVonGruppenmitglied1: 9191991,
            gruppenmitglied2: "Biene Jürgen",
            matrikelnummerVonGruppenmitglied2: 2345678,
            studentenSindAnHochschule: true,
            studentenSindBeiFirma: false,
            startVorlesungszeit: true,
            startZum: new Date("2024-10-01"),
            begruendungFuerDatum: "Weils Passt"
        }) as AntragAnlage2Resource;
        logger.info("Prefill AntragAnlage2 created: " + antragAnlage2);

        const application = await antragZulassungService.createApplication({
            creator: user.id?.toString(),
            studentid: user.studentId,
            department: "Fachbereich VI",
            bachelor: true,
            master: false,
            userDetails: {
                lastName: "Hans",
                firstName: "Maulwurf",
                street: "Hügelfeld 1",
                city: "Berlin",
                postalCode: "133749",
                country: "Deutschland",
                phone: "0123456789",
            },
            internshipCompleted: false,
            recognitionApplied: false,
            modulesCompleted: false,
            modulesPending: false,
            attachment2Included: false,
            topicSuggestion: false,
            date: new Date(),
        }) as ApplicationResource;
        logger.info("Prefill Application created: " + application);

        return { user, AntragAnlage2: antragAnlage2, application };
    } else {
        logger.info("Prefill User already exists: " + existUser);
        return null;
    }
}
