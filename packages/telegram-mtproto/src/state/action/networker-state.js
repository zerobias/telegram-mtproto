//@flow

/*::import { NetMessage } from '../../service/networker/net-message'*/
import { doubleCreator, type ActionPair } from '../helpers'

type NetworkerMeta = number

type NetworkerState = {
  RESEND: {
    ADD: ActionPair<'networker/resend add', string[], NetworkerMeta>,
    DEL: ActionPair<'networker/resend delete', string[], NetworkerMeta>,
  },
  SENT: {
    ADD: ActionPair<'networker/sent add', NetMessage[], NetworkerMeta>,
    DEL: ActionPair<'networker/sent delete', NetMessage[], NetworkerMeta>,
  },
  PENDING: {
    ADD: ActionPair<'networker/pending add', string[], NetworkerMeta>,
    DEL: ActionPair<'networker/pending delete', string[], NetworkerMeta>,
  },
}

const networkerMeta = (_: any, dc: number) => ({ _: 'networker', id: dc })

export const NETWORKER_STATE: NetworkerState = {
  RESEND: {
    ADD: doubleCreator('networker/resend add', networkerMeta),
    DEL: doubleCreator('networker/resend delete', networkerMeta),
  },
  SENT: {
    ADD: doubleCreator('networker/sent add', networkerMeta),
    DEL: doubleCreator('networker/sent delete', networkerMeta),
  },
  PENDING: {
    ADD: doubleCreator('networker/pending add', networkerMeta),
    DEL: doubleCreator('networker/pending delete', networkerMeta),
  },
}
