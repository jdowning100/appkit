import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Code,
  Heading,
  HStack,
  Text,
  VStack,
  useColorMode
} from '@chakra-ui/react'

interface LogEntry {
  id: string
  timestamp: string
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  args: any[]
}

export function ConsoleLogDisplay() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const { colorMode } = useColorMode()

  useEffect(() => {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    }

    // Create new log entry
    const createLogEntry = (type: LogEntry['type'], ...args: any[]): LogEntry => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '),
      args
    })

    // Override console methods
    console.log = (...args) => {
      originalConsole.log(...args)
      setLogs(prev => [...prev, createLogEntry('log', ...args)])
    }

    console.warn = (...args) => {
      originalConsole.warn(...args)
      setLogs(prev => [...prev, createLogEntry('warn', ...args)])
    }

    console.error = (...args) => {
      originalConsole.error(...args)
      setLogs(prev => [...prev, createLogEntry('error', ...args)])
    }

    console.info = (...args) => {
      originalConsole.info(...args)
      setLogs(prev => [...prev, createLogEntry('info', ...args)])
    }

    // Cleanup function
    return () => {
      console.log = originalConsole.log
      console.warn = originalConsole.warn
      console.error = originalConsole.error
      console.info = originalConsole.info
    }
  }, [])

  const clearLogs = () => {
    setLogs([])
  }

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return 'red.500'
      case 'warn':
        return 'orange.500'
      case 'info':
        return 'blue.500'
      default:
        return 'gray.500'
    }
  }

  if (!isVisible) {
    return (
      <Box position="fixed" bottom={4} right={4} zIndex={1000}>
        <Button
          onClick={() => setIsVisible(true)}
          colorScheme="blue"
          size="sm"
          borderRadius="full"
          boxShadow="lg"
        >
          Show Console ({logs.length})
        </Button>
      </Box>
    )
  }

  return (
    <Card
      position="fixed"
      bottom={4}
      right={4}
      width="400px"
      maxHeight="500px"
      zIndex={1000}
      boxShadow="xl"
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
    >
      <CardHeader pb={2}>
        <HStack justify="space-between">
          <Heading size="sm">Console Logs</Heading>
          <HStack spacing={2}>
            <Button size="xs" onClick={clearLogs}>
              Clear
            </Button>
            <Button size="xs" onClick={() => setIsVisible(false)}>
              Hide
            </Button>
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack
          spacing={2}
          maxHeight="400px"
          overflowY="auto"
          alignItems="stretch"
        >
          {logs.length === 0 ? (
            <Text fontSize="sm" color="gray.500" textAlign="center">
              No logs yet
            </Text>
          ) : (
            logs.slice(-50).map((log) => (
              <Box
                key={log.id}
                p={2}
                borderRadius="md"
                bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
                borderLeft="3px solid"
                borderLeftColor={getLogColor(log.type)}
              >
                <HStack spacing={2} mb={1}>
                  <Text fontSize="xs" color={getLogColor(log.type)} fontWeight="bold">
                    [{log.type.toUpperCase()}]
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {log.timestamp}
                  </Text>
                </HStack>
                <Code
                  fontSize="xs"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  bg="transparent"
                  p={0}
                >
                  {log.message}
                </Code>
              </Box>
            ))
          )}
        </VStack>
      </CardBody>
    </Card>
  )
} 