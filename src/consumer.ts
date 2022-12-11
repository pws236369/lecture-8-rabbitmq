import { createServer, IncomingMessage, ServerResponse } from "http";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { updateItem, mainRoute } from "./routes.js";
import { PUT_ITEM } from "./const.js";
import * as amqp from "amqplib";

const port = 3001;

const consumeMessages = async () => {
  try {
    // connect to RabbitMQ
    const conn = await amqp.connect(
      "amqps://poydjifg:koR7IuNQyO4fmuvNGK0byP6oaN3fo8zs@sparrow.rmq.cloudamqp.com/poydjifg"
    );
    const channel = await conn.createChannel();

    // create the exchange if it doesn't exist
    const exchange = "order_exchange";
    await channel.assertExchange(exchange, "fanout", { durable: false });

    // create the queue if it doesn't exist
    const queue = "order_queue";
    await channel.assertQueue(queue, { durable: false });

    // bind the queue to the exchange
    await channel.bindQueue(queue, exchange, "");

    // consume messages from the queue
    await channel.consume(queue, (msg) => {
      console.log(`Comsumer >>> received message: ${msg.content.toString()}`);
      channel.ack(msg);
    });
  } catch (error) {
    console.error(error);
  }
};

// start consuming messages
consumeMessages();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const route = req.method + " " + req.url;
  switch (route) {
    case PUT_ITEM:
      updateItem(req, res);
      break;
    default:
      mainRoute(req, res, "Consumer");
      break;
  }
});

server.listen(port);
console.log(`Consumer - port ${port}`);
