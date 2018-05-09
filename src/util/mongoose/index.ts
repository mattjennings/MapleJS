import { Document } from 'mongoose'

export const getDocumentId = (document: Document) => {
  return parseInt(String(document._id).substr(0, 8), 16)
}
