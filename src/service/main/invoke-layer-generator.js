//@flow

/**
 * Defines the parameter required for authorization based on the level number
 *
 * Values were taken from here
 * https://github.com/telegramdesktop/tdesktop/blob/dev/Telegram/Resources/scheme.tl
 *
 * @param {number} apiLevel
 * @returns
 */
function generateInvokeLayer(apiLevel: number) {
  switch (apiLevel) {
    case 1: return 0x53835315
    case 2: return 0x289dd1f6
    case 3: return 0xb7475268
    case 4: return 0xdea0d430
    case 5: return 0x417a57ae
    case 6: return 0x3a64d54d
    case 7: return 0xa5be56d3
    case 8: return 0xe9abd9fd
    case 9: return 0x76715a63
    case 10: return 0x39620c41
    case 11: return 0xa6b88fdf
    case 12: return 0xdda60d3c
    case 13: return 0x427c8ea2
    case 14: return 0x2b9b08fa
    case 15: return 0xb4418b64
    case 16: return 0xcf5f0987
    case 17: return 0x50858a19
    case 18: return 0x1c900537
    default: return 0xda9b0d0d
  }
}

export default generateInvokeLayer