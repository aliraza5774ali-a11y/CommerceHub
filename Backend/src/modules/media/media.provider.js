export class StorageProvider {
  async createReference() { throw new Error('Storage provider is not configured'); }
  async deleteReference() { throw new Error('Storage provider is not configured'); }
}

export class ReferenceStorageProvider extends StorageProvider {
  async createReference(input) { return { fileUrl: input.fileUrl, provider: 'reference' }; }
  async deleteReference() { return true; }
}
