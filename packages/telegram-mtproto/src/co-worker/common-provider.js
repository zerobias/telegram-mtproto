//@flow
import { isNode } from 'Runtime'

type WebCryptoType = {
  digest(
    conf: {
      name: 'SHA-1' | 'SHA-256'
    },
    data: number[] | Uint8Array | ArrayBuffer
  ): Promise<ArrayBuffer>
}

function testWebCrypto(): void | WebCryptoType {
  let webCrypto

  try {
    /* eslint-disable */
    if (typeof window !== 'undefined') {
      if (window.crypto) {
        webCrypto =
          window.crypto.subtle
          || window.crypto.webkitSubtle
      } else if (window.msCrypto) {
        webCrypto = window.msCrypto.subtle
      }
    }
  } finally {
    return webCrypto
  }
}

const cryptoCommon = (() => {
  const webCrypto = testWebCrypto()
  const useWebCrypto = !!webCrypto
  const sha1Crypto = useWebCrypto
  const sha256Crypto = useWebCrypto
  return {
    webCrypto,
    use: {
      webCrypto: useWebCrypto,
      sha1Crypto,
      sha256Crypto,
      webworker: !isNode,
    }
  }
})()

export default cryptoCommon
