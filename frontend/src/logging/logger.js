import log4javascript from "log4javascript";

const logger = log4javascript.getLogger();
const consoleAppender = new log4javascript.BrowserConsoleAppender();

logger.addAppender(consoleAppender);

export default logger;