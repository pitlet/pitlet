import { Api } from 'bsp-types'

export interface RequiredApi {
  readonly emitError: Api['emitError']
  readonly getContent: Api['getContent']
}

export interface Options {}
