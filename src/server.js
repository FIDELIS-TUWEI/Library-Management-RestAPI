const app = require("./app");
const connectMongoDB = require("./db/MongoDB");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
    connectMongoDB();
    logger.info(`Server running on port: ${config.PORT}`)
});