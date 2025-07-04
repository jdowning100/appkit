import type { SessionParams } from '../types/index.js'

// Allow localhost
export const BASE_URL = process.env['BASE_URL'] || 'http://localhost:3000/'
export const WALLET_URL = process.env['WALLET_URL'] || 'https://react-wallet.walletconnect.com'
export const DEFAULT_SESSION_PARAMS: SessionParams = {
  reqAccounts: ['1', '2'],
  optAccounts: ['1', '2'],
  accept: true
}
export const SECURE_WEBSITE_URL = 'https://secure.reown.com'
export const DEFAULT_CHAIN_NAME = process.env['DEFAULT_CHAIN_NAME'] || 'Ethereum'

export const EXTENSION_RDNS = 'reown.com'
export const EXTENSION_NAME = 'Reown'
export const ALL_SOCIALS = ['google', 'farcaster', 'github', 'discord', 'apple', 'facebook']
