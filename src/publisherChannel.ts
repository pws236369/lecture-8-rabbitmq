import * as amqp from "amqplib";

export class PublisherChannel {
  channel: amqp.Channel;

  async createChannel() {
    const connection = await amqp.connect(
      "amqps://poydjifg:koR7IuNQyO4fmuvNGK0byP6oaN3fo8zs@sparrow.rmq.cloudamqp.com/poydjifg"
    );
    this.channel = await connection.createChannel();
  }

  async sendEvent(msg: string) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchange = "order_exchange";

    // create the exchange if it doesn't exist
    await this.channel.assertExchange(exchange, "fanout", { durable: false });

    // publish the message to the exchange
    await this.channel.publish(exchange, "", Buffer.from(msg));
    console.log(
      `Publisher >>> | message "${msg}" published to exchange "${exchange}"`
    );
  }
}
