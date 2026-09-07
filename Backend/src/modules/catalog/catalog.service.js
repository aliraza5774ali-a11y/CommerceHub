import { withTransaction } from '../../database/connection.js';
import { AppError, assertFound } from '../../utils/errors.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { catalogRepository } from './catalog.repository.js';

function assertPublishable(product) {
  if (!product.name?.trim() || !product.slug || product.price === null || product.price === undefined || Number(product.price) < 0) {
    throw new AppError('Product is incomplete and cannot be published', 422, 'PRODUCT_NOT_PUBLISHABLE');
  }
  if (product.salePrice !== null && product.salePrice !== undefined && Number(product.salePrice) > Number(product.price)) {
    throw new AppError('Sale price cannot exceed the product price', 422, 'PRODUCT_NOT_PUBLISHABLE');
  }
}

export const catalogService = {
  async publish({ productId, tenantId }, dependencies = {}) {
    const transaction = dependencies.transaction || withTransaction;
    const products = dependencies.catalogRepository || catalogRepository;
    const inventory = dependencies.inventoryRepository || inventoryRepository;

    return transaction(async (connection) => {
      const product = assertFound(await products.findByIdForUpdate(productId, tenantId, connection), 'Product not found');
      if (product.status !== 'draft') throw new AppError('Only draft products can be published', 409, 'INVALID_PRODUCT_STATUS');
      assertPublishable(product);

      const publishedProduct = await products.publish(productId, tenantId, connection);
      if (!publishedProduct) throw new AppError('Product changed and could not be published', 409, 'CONFLICT');
      const initializedInventory = await inventory.initialize(productId, tenantId, connection);
      return { product: publishedProduct, inventory: initializedInventory };
    });
  }
};
