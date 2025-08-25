'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileSignature,
  Sun, 
  Moon,
  Wallet,
  FolderOpen,
  Users,
  ArrowLeftRight,
  LogOut,
  Settings
} from 'lucide-react'

export default function Navbar() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const navItems = [
    { 
      icon: Wallet, 
      label: 'פגישות פעילות', 
      isActive: true,
      badge: '3' 
    },
    { 
      icon: FolderOpen, 
      label: 'היסטוריה', 
      isActive: false 
    },
    { 
      icon: Users, 
      label: 'משתתפים', 
      isActive: false 
    },
    { 
      icon: ArrowLeftRight, 
      label: 'העברות', 
      isActive: false 
    },
  ]

  return (
    <div className="w-64 bg-base-100 border-r border-border/50 flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary-100 text-white font-semibold">
              א
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-custom-100">אדמין מערכת</h3>
            <p className="text-sm text-custom-200">מנהל</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <div
              key={index}
              className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg cursor-pointer transition-colors ${
                item.isActive
                  ? 'bg-primary-100/20 text-primary-200 border border-primary-100/30'
                  : 'text-custom-200 hover:text-custom-100 hover:bg-base-300'
              }`}
            >
              <div className={`p-2 rounded-md ${
                item.isActive ? 'bg-primary-100' : 'bg-base-300'
              }`}>
                <IconComponent className={`h-4 w-4 ${
                  item.isActive ? 'text-white' : 'text-custom-200'
                }`} />
              </div>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto bg-primary-100 text-white hover:bg-primary-100">
                  {item.badge}
                </Badge>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/30 space-y-2">
        <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg cursor-pointer text-custom-200 hover:text-custom-100 hover:bg-base-300 transition-colors">
          <div className="p-2 rounded-md bg-base-300">
            <Settings className="h-4 w-4" />
          </div>
          <span className="font-medium">הגדרות</span>
        </div>
        
        <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg cursor-pointer text-custom-200 hover:text-custom-100 hover:bg-base-300 transition-colors">
          <div className="p-2 rounded-md bg-base-300">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="font-medium">יציאה</span>
        </div>
      </div>
    </div>
  )
}