'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { toggleThemeAtom, isDarkModeAtom } from '@/store/theme';

export function ThemeToggle() {
  const [isDarkMode] = useAtom(isDarkModeAtom);
  const [, toggleTheme] = useAtom(toggleThemeAtom);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        variant="glass"
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDarkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
}
