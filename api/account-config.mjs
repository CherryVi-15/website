import {endpoint} from '../server/core.mjs'
import {authConfig} from '../server/auth.mjs'
export const GET=endpoint(()=>authConfig())
