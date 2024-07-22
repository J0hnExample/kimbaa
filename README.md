# [KiMBAA](https://kimbaa-demo.de "Kimbaa website")


![Kimbaa logo](/res/kimbaa_logo.jpg "kimbaa logo")

KiMBAA Data-Scraper-Web-App zum Extrahieren von Daten und Stellen von Anträgen 


"kimbaa" soll Studierende beim application ihrer Bachelorarbeit unterstützen, indem sie die Voraussetzungen vorab prüft und wichtige Hilfestellungen und Planungshinweise gibt.

Die live seite: [kimbaa-demo.de](https://kimbaa-demo.de)

---

## Funktionen

- User-Account
    - Anlegen
    - Speichern 
    - Aufrufen

- Automatisches Einlesen der Credits des Studierenden
    - Import von Studiendaten über Polli API
    - PDF parsen 

- Beantworten von Fragen zu spezifischen Modulen wie Praktikum und Projekt
    - Liegt ein Arbeitsvertrag vor?
- Beantworten von Fragen zur Betreuung der Abschlussarbeit
    - Externer/Interne Betreuung?
    - Liegen ggf. die Qualifikationen der betreuenden Person vor?

- Basierend auf den gesammelten Daten wird ermittelt, ob die Voraussetzungen für den application auf die Bachelorarbeit erfüllt sind
    - Wie viele CPs sind offen?
    - Rating offener Module/Regeln der Studien- und Prüfungsordnung.

- Anzeige von Tipps zur Betreuung der Abschlussarbeit
- Unterstützung bei der Wahl eines Titels für die Abschlussarbeit
    - Rechtschreib- und Grammatikprüfung
    - Bereitstellung aussagekräftiger Beschreibungen

- Abgabe der gesammelten Informationen
    - Druckfunktion
    - PDF Export
    - Online-Einreichung

---

## Techstack

### Frontend 

- Express.js für die REST-API
- HTML5, CSS3 und JavaScript für die Gestaltung der Benutzeroberfläche
- Bootstrap oder Material-UI für das responsive Design und die Gestaltung der Benutzeroberfläche
- React.js oder Angular für die Entwicklung der Benutzeroberfläche und die Verwaltung des Zustands der Anwendung
- Webpack oder Parcel für das Bündeln und Optimieren des Frontend-Codes
- Jest, Mocha oder andere Testframeworks für die Erstellung von Unit- und Integrationstests
- ESLint oder Prettier für die Codequalitätssicherung und das Einhalten von Code-Standards

### Backend 

- JavaScript/Python für die Backend-Entwicklung
- Redux oder Zustandshooks für die Verwaltung des globalen Zustands der Anwendung
- Nutzung von Frameworks für Webcrawler und PDF-Parsing
- Axios oder Fetch API für die Kommunikation mit der REST-API

### Datenbank 

- MongoDB

### Deployment

- GitLab build pipelines
- Docker
- Nginx (reverse proxy)


## Weitere Punkte

- Barrierefreiheit
- Verschiedene Sprachen


## Credits

Product Owner: Sascha Benjamin

Scrum-Master:  Trung Nguyen

QA: Trung Nguyen

Frontend: Arthur Goldenbaum & Marc Ewert

Backend: Sascha Benjamin

DevOps: James Laycock
