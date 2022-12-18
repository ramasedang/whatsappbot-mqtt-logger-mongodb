import Aedes from "aedes";
import { createServer } from "net";

const aedes = Aedes();
const server = createServer(aedes.handle);

const broker_1 = async () => {
    server.listen(1883, function () {
        console.log("Broker1 started and listening on port 1883");
    });
}
broker_1();


