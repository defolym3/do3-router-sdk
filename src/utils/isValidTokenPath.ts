import { Currency, Token } from '@defolym3/do3-sdk-core'
import { TPool } from './TPool'

export function isValidTokenPath(currentPool: TPool, inputToken: Currency): boolean {
  if (currentPool.involvesToken(inputToken as Token)) return true

  return false
}
