import { pool } from '../database/connection.js';

export async function recordAudit({ tenantId, userId, action, resourceType, resourceId, metadata, ipAddress, connection = pool }) {
  const safeMetadata = metadata ? JSON.stringify(metadata) : null;
  await connection.execute('INSERT INTO audit_logs (business_id, user_id, action, resource_type, resource_id, metadata, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)', [tenantId || null, userId || null, action, resourceType, resourceId == null ? null : String(resourceId), safeMetadata, ipAddress || null]);
}
