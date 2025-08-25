'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  FileSignature,
  Sun, 
  Moon
} from 'lucide-react'

export default function Header() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="bg-base-100 border-b border-border/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <FileSignature className="h-8 w-8 text-primary-100" />
            <div>
              <h1 className="text-xl font-bold text-custom-100">NMM</h1>
              <p className="text-xs text-custom-200">No Meet Manager</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="border-border/50 hover:bg-base-200"
          >
            {isDark ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          <div className="text-sm text-custom-200 bg-base-200 px-3 py-2 rounded-lg">
            3 פגישות מחכות לחתימה
          </div>
        </div>
      </div>
    </header>
  )
}