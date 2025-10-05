import { useEffect } from 'react';

export function useKeyboardShortcut(keys, callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      keys.forEach(key => {
        const [modifier, keyPress] = key.toLowerCase().split('+');
        
        const modifierPressed = 
          (modifier === 'cmd' && isMac && event.metaKey) ||
          (modifier === 'ctrl' && !isMac && event.ctrlKey) ||
          (modifier === 'ctrl' && event.ctrlKey) ||
          (modifier === 'shift' && event.shiftKey) ||
          (modifier === 'alt' && event.altKey);
        
        if (modifierPressed && event.key.toLowerCase() === keyPress) {
          callback(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback]);
}