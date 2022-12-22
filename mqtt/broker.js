import Aedes from "aedes";
import { createServer } from "aedes-server-factory";

const aedes = Aedes();
const server = createServer(aedes, { ws: true });
const PORT = process.env.PORT || 1883;

const broker_1 = async () => {
    server.listen(PORT, function () {
        console.log("Broker1 started and listening on port 1883");
    });
}
broker_1();


