import { IAntragAnlage2, AntragAnlage2 } from "../model/AntragAnlage2Model";
import { logger } from "../logger/serviceLogger";
import { AntragAnlage2Resource } from "../Resources";
import { User } from "../model/UserModel";

export async function createAntragAnlage2(antragAnlage2Resource: AntragAnlage2Resource): Promise<IAntragAnlage2> {
    logger.info("AntragAnlage2Service.createAntragAnlage2 wird gestartet");

    try {
        const anlage2 = new AntragAnlage2(antragAnlage2Resource);
        await anlage2.save();
        logger.info("AntragAnlage2Service.createAntragAnlage2: Antrag erstellt mit ID: " + anlage2.id);
        return anlage2;
    } catch (error) {
        logger.error("AntragAnlage2Service: Create : " + error);
        throw new Error("Antrag Erstellung Fehler: " + error);
    }
}

export async function getAntragAnlage2ById(id: string): Promise<IAntragAnlage2 | null> {
    logger.info("AntragAnlage2Service.getAntragAnlage2ById wird gestartet");
    //find user by id
    const user = await User.findById({ _id: id }).exec();

    if (user) {
        try {
            const anlage2 = await AntragAnlage2.findOne({ creator: { $eq: user.id } }).exec();
            if (anlage2 === null) {
                return null;
            }
            logger.info("AntragAnlage2Service.getAntragAnlage2ById: Antrag gefunden mit ID: " + anlage2.id);
            return anlage2;
        } catch (error) {
            logger.error("AntragAnlage2Service: Get : " + error);
            throw new Error("Fehler beim Abrufen des Antrags: " + error);
        }
    } else {
        throw new Error("User nicht gefunden.");
    }
}

export async function updateAntragAnlage2(antragAnlage2Resource: AntragAnlage2Resource): Promise<IAntragAnlage2> {
    logger.info("AntragAnlage2Service.updateAntragAnlage2 wird gestartet");

    const anlage2 = await AntragAnlage2.findById(antragAnlage2Resource.id).exec();

    if (anlage2 && anlage2 !== null) {
        Object.assign(anlage2, antragAnlage2Resource);
        await anlage2.save();
        logger.info("AntragAnlage2Service.updateAntragAnlage2: Antrag aktualisiert mit ID: " + anlage2.id);
        return anlage2;
    } else {
        throw new Error("Antrag nicht gefunden.");
    }
}

export async function deleteAntragAnlage2(id: string): Promise<void> {
    logger.info("AntragAnlage2Service.deleteAntragAnlage2 wird gestartet");

    const anlage2 = await AntragAnlage2.findById(id).exec();

    if (anlage2 === null) {
        throw new Error("Antrag nicht gefunden.");
    }
    if (anlage2 !== null) {
        logger.info("AntragAnlage2Service.deleteAntragAnlage2: Antrag gefunden und bereit zu löschen: " + anlage2.id);
        await anlage2.deleteOne();
        logger.info("AntragAnlage2Service.deleteAntragAnlage2: Antrag gelöscht: " + anlage2.id);
    }
}
