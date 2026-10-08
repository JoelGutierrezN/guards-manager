import type { LoaderFunctionArgs } from 'react-router'
import type { CustodyDetailLoaderData } from '../../domain/custody-detail-loader.model'
import { custodiesRepository } from '../repositories/custodies.repository'
import { CustodyErrorHelper } from '../helpers/custody-error.helper'

export async function custodyDetailLoader({
  params,
}: LoaderFunctionArgs): Promise<CustodyDetailLoaderData> {
  const custodyId = params.custodyId
  if (custodyId == null || custodyId === '') {
    return { custody: null, error: CustodyErrorHelper.notFoundMessage() }
  }

  try {
    return { custody: await custodiesRepository.get(custodyId), error: null }
  } catch (error) {
    return { custody: null, error: CustodyErrorHelper.detailMessageFrom(error) }
  }
}
