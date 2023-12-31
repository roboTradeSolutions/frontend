import React from 'react';

import * as cookies from 'lib/cookies';
// import IconSvg from 'ui/shared/IconSvg';

// import ColorModeSwitchTheme from './ColorModeSwitchTheme';
import { COLOR_THEMES } from './utils';

const ColorModeSwitch = () => {
  // const { isOpen, onToggle, onClose } = useDisclosure();
  // const { setColorMode, colorMode } = useColorMode();

  // const [ activeHex, setActiveHex ] = React.useState<string>();

  const setTheme = React.useCallback((hex: string) => {
    const nextTheme = COLOR_THEMES.find((theme) => theme.colors.some((color) => color.hex === hex));

    if (!nextTheme) {
      return;
    }

    // setColorMode(nextTheme.colorMode);

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    window.document.documentElement.style.setProperty(varName, hex);

    cookies.set(cookies.NAMES.COLOR_MODE_HEX, hex);
    cookies.set(cookies.NAMES.COLOR_MODE, 'dark');
  }, [ ]);

  React.useEffect(() => {
    // const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE);

    // const nextColorMode = (() => {
    //   if (!cookieColorMode) {
    //     return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    //   }

    //   return colorMode;
    // })();

    // const fallbackHex = (COLOR_THEMES.find(theme => theme.colorMode === nextColorMode && theme.colors.length === 1) ?? COLOR_THEMES[0]).colors[0].hex;
    // const cookieHex = cookies.get(cookies.NAMES.COLOR_MODE_HEX) ?? fallbackHex;]
    cookies.set(cookies.NAMES.COLOR_MODE_HEX, '#101112');
    cookies.set(cookies.NAMES.COLOR_MODE, 'dark');
    setTheme('#101112');
    // setActiveHex('#101112');
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  // const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
  //   event.stopPropagation();

  //   const hex = event.currentTarget.getAttribute('data-hex');

  //   if (!hex) {
  //     return;
  //   }

  //   setTheme(hex);
  //   setActiveHex(hex);
  // }, [ setTheme ]);

  // const activeTheme = COLOR_THEMES.find((theme) => theme.colors.some((color) => color.hex === activeHex));

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};

export default ColorModeSwitch;
