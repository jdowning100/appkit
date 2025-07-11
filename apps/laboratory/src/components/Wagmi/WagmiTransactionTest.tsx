import { useCallback, useState } from 'react'

import { Button, Link, Spacer, Stack, Text } from '@chakra-ui/react'
import { type Address, parseEther } from 'viem'
import { useAccount, useEstimateGas, useSendTransaction } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { useChakraToast } from '@/src/components/Toast'
import { vitalikEthAddress } from '@/src/utils/DataUtil'

const TEST_TX = {
  to: vitalikEthAddress as Address,
  value: parseEther('0.001')
}

export function WagmiTransactionTest() {
  const { status, chain } = useAccount()

  return Number(chain?.id) !== mainnet.id && status === 'connected' ? (
    <AvailableTestContent />
  ) : (
    <Text fontSize="md" color="yellow">
      Feature not available on Ethereum Mainnet
    </Text>
  )
}

function AvailableTestContent() {
  const toast = useChakraToast()
  const { refetch: estimateGas, isFetching: estimateGasFetching } = useEstimateGas({
    ...TEST_TX,
    query: {
      enabled: false
    }
  })
  const [isLoading, setLoading] = useState(false)

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: hash => {
        setLoading(false)
        toast({
          title: 'Transaction Success',
          description: hash,
          type: 'success'
        })
      },
      onError: error => {
        setLoading(false)
        console.error(error)
        toast({
          title: 'Error',
          description: error?.message || 'Failed to sign transaction',
          type: 'error',
          partialDescription: false
        })
      }
    }
  })

  const onSendTransaction = useCallback(async () => {
    const { data: gas, error: prepareError } = await estimateGas()

    if (prepareError) {
      console.error(prepareError)
      toast({
        title: 'Error',
        description: prepareError?.message || 'Failed to sign transaction',
        type: 'error',
        partialDescription: false
      })
    } else {
      setLoading(true)
      sendTransaction({
        ...TEST_TX,
        gas
      })
    }
  }, [sendTransaction, estimateGas])

  return (
    <Stack direction={['column', 'column', 'row']}>
      <Button
        data-testid="sign-transaction-button"
        onClick={onSendTransaction}
        disabled={!sendTransaction}
        isDisabled={isLoading}
        isLoading={estimateGasFetching}
      >
        Send Transaction to Vitalik
      </Button>

      <Spacer />

      <Link isExternal href="https://sepoliafaucet.com">
        <Button variant="outline" colorScheme="blue" isDisabled={isLoading}>
          Sepolia Faucet 1
        </Button>
      </Link>

      <Link isExternal href="https://www.infura.io/faucet/sepolia">
        <Button variant="outline" colorScheme="orange" isDisabled={isLoading}>
          Sepolia Faucet 2
        </Button>
      </Link>
    </Stack>
  )
}
