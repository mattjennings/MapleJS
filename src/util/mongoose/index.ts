import { Document } from 'mongoose'

// export const getDocumentId = (document: Document) => {
//   // return parseInt(String(document._id).substr(0, 16), 16)
// }

// export const findDocumentByCutoffId = async (model, documentId, filterAdditions) => {
//   const filter = filterAdditions || {} // 1525927570
//   documentId = documentId.toString(16)

//   let query = model.find()
//   for (const index in filter) {
//     query = query.where(index).equals(filter[index])
//   }
//   query = query.select('_id')

//   const rows = await query.exec()

//   for (let i = 0; i < rows.length; i++) {
//     if (rows[i]._id.toString().indexOf(documentId) === 0) {
//       return model.findById(rows[i]._id)
//     }
//   }

//   return null
// }
