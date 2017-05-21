//@flow
import type { MTProto } from '../service/main'
const CHUNK_SIZE = 10240

const usedMethod = 'upload.getFile'

type MTInputFileLocation =
  'inputDocumentFileLocation'
  | 'inputVideoFileLocation'

type MTLocation = {
  _: MTInputFileLocation,
  id: string,
  access_hash: string,
}

type MTDocument = {
  _: 'document',
  id: string,
  access_hash: string,
  mime_type: 'video/mp4' | 'text/x-log',
  size: number,
  dc_id: number,
  version: number,
}



// const downloadFilePart = (
//   location,
//   chunkNum: number = 0,
//   telegram
// ) => {
//   const args = {
//     location,
//     offset: CHUNK_SIZE * chunkNum,
//     limit : CHUNK_SIZE,
//   }
//   return telegram(usedMethod, args)
// }

const getOffset = (chunkNum: number = 0) => CHUNK_SIZE * chunkNum

const getArgs = (location: MTLocation, offset: number) => ({
  location,
  offset,
  limit: CHUNK_SIZE,
})

const getLocation = (doc: MTDocument): MTLocation => ({
  _          : 'inputDocumentFileLocation',
  id         : doc.id,
  access_hash: doc.access_hash
})

const downloadDocument =
  (ctx: MTProto) =>
    async (doc: MTDocument) => {
      // console.dir(ctx, { colors: true })
      const location = getLocation(doc)
      const parts = Math.ceil(doc.size / CHUNK_SIZE)
      const results = new Uint8Array(doc.size)
      for (let i = 0; i < parts; i++) {
        const offset = getOffset(i)
        const args = getArgs(location, offset)
        const response = await ctx.api.mtpInvokeApi(usedMethod, args)
        results.set(response.bytes, offset)
      }
      return results
    }

downloadDocument.pluginName = 'loadFile'

export default downloadDocument
