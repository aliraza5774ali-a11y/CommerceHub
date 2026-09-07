export class PaymentGateway {
  constructor(name) { this.name = name; }
  async createPayment() { throw new Error(`${this.name} payment gateway is not configured`); }
  async verifyPayment() { throw new Error(`${this.name} payment gateway is not configured`); }
  async refundPayment() { throw new Error(`${this.name} payment gateway is not configured`); }
}

export class CodGateway extends PaymentGateway {
  constructor() { super('manual-cod'); }
  async createPayment({ amount }) { return { status: 'PENDING', amount, providerReference: null }; }
}
