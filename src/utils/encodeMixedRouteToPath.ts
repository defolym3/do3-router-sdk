import { pack } from '@ethersproject/solidity'
import { Currency, Token } from '@defolym3/do3-sdk-core'
import { Pool } from '@defolym3/do3-v3-sdk2'
import { MixedRouteSDK } from '../entities/mixedRoute/route'
import { V2_FEE_PATH_PLACEHOLDER } from '../constants'
import { TPool } from './TPool'

/**
 * Converts a route to a hex encoded path
 * @notice only supports exactIn route encodings
 * @param route the mixed path to convert to an encoded path
 * @returns the exactIn encoded path
 */
export function encodeMixedRouteToPath(route: MixedRouteSDK<Currency, Currency>): string {
  const firstInputToken: Token = route.input.wrapped

  const { path, types } = route.pools.reduce(
    (
      { inputToken, path, types }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: TPool,
      index
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken: Token = pool.token0.equals(inputToken) ? pool.token1 : pool.token0
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER, outputToken.address],
        }
      } else {
        return {
          inputToken: outputToken,
          types: [...types, 'uint24', 'address'],
          path: [...path, pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER, outputToken.address],
        }
      }
    },
    { inputToken: firstInputToken, path: [], types: [] }
  )

  return pack(types, path)
}
