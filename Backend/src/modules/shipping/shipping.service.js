import { shippingRepository } from './shipping.repository.js';
import { AppError, assertFound } from '../../utils/errors.js';
import { withTransaction } from '../../database/connection.js';

const transitions = { PENDING: ['PROCESSING', 'CANCELLED'], PROCESSING: ['SHIPPED', 'CANCELLED'], SHIPPED: ['IN_TRANSIT'], IN_TRANSIT: ['OUT_FOR_DELIVERY'], OUT_FOR_DELIVERY: ['DELIVERED'] };
export const shippingService = {
  createMethod: (input, tenantId) => shippingRepository.createMethod(input, tenantId),
  addAddress: (input, tenantId, userId) => shippingRepository.addAddress(input, tenantId, userId),
  addresses: (tenantId, userId) => shippingRepository.addresses(tenantId, userId),
  methods: (tenantId) => shippingRepository.methods(tenantId),
  async createShipment({ orderId, addressId, shippingMethodId, tenantId, userId }) { const order = assertFound(await shippingRepository.order(orderId, tenantId, userId), 'Order not found'); if (!['PAID', 'PROCESSING'].includes(order.status)) throw new AppError('Shipment requires a paid order', 409, 'INVALID_ORDER_STATUS'); if (!(await shippingRepository.address(addressId, tenantId, userId))) throw new AppError('Shipping address not found', 404, 'ADDRESS_NOT_FOUND'); if (!(await shippingRepository.methods(tenantId)).some((method) => String(method.id) === String(shippingMethodId))) throw new AppError('Shipping method not found', 404, 'SHIPPING_METHOD_NOT_FOUND'); return shippingRepository.createShipment({ orderId, addressId, shippingMethodId }, tenantId, userId); },
  async get(orderId, tenantId, userId) { return assertFound(await shippingRepository.shipmentByOrder(orderId, tenantId, userId), 'Shipment not found'); },
  async transition(id, tenantId, userId, next, version, trackingNumber, dependencies = {}) {
    const transaction = dependencies.transaction || withTransaction;
    const repository = dependencies.shippingRepository || shippingRepository;
    return transaction(async (connection) => {
      const shipment = assertFound(dependencies.staff ? await repository.shipmentForStaff(id, tenantId, connection) : await repository.shipmentForUpdate(id, tenantId, userId, connection), 'Shipment not found');
      if (!transitions[shipment.status]?.includes(next)) throw new AppError('Invalid shipment status transition', 409, 'INVALID_SHIPMENT_STATUS');
      if (!(await (dependencies.staff ? repository.updateStatusForStaff(id, tenantId, shipment.status, next, version, trackingNumber, connection) : repository.updateStatus(id, tenantId, userId, shipment.status, next, version, trackingNumber, connection)))) throw new AppError('Shipment changed, reload and retry', 409, 'CONFLICT');
      if (next === 'DELIVERED') {
        const order = assertFound(await (dependencies.staff ? repository.orderForStaff(shipment.orderId, tenantId, connection) : repository.orderForUpdate(shipment.orderId, tenantId, userId, connection)), 'Order not found');
        if (!['PAID', 'PROCESSING', 'SHIPPED'].includes(order.status) || !(await (dependencies.staff ? repository.markOrderDeliveredForStaff(order.id, tenantId, order.status, connection) : repository.markOrderDelivered(order.id, tenantId, userId, order.status, connection)))) {
          throw new AppError('Order changed and could not be marked as delivered', 409, 'CONFLICT');
        }
      }
      return dependencies.staff ? repository.shipmentForStaffRead(id, tenantId, connection) : repository.shipment(id, tenantId, userId, connection);
    });
  }
};
