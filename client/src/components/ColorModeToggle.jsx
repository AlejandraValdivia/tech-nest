import { useColorMode, IconButton } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons';


const ColorModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      size='md'
      fontSize='lg'
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      variant='ghost'
      color='current'
      ml={{ base: '0', md: '3' }}
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    />
  )
}

export default ColorModeToggle
