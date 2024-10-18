'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ReduxProvider } from '@/components/ReduxProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Box, Flex } from '@chakra-ui/react'
import theme from '../theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
        <ChakraProvider theme={theme}>
            <Flex flexDirection="column" minHeight="100vh">
              <Navbar />
              <Box flex="1">
                {children}
              </Box>
              <Footer />
            </Flex>
          </ChakraProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}