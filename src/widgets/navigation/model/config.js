import homeCheckIcon from '@/assets/icons/hero/24/solid/home.svg'
import checkCircleIcon from '@/assets/icons/hero/24/solid/check-circle.svg'
import documentTextIcon from '@/assets/icons/hero/24/solid/document-text.svg'
import settingsIcon from '@/assets/icons/hero/24/solid/cog-6-tooth.svg'

export const tabs = [
  {
    name: 'dashboard',
    title: 'Dashboard',
    url: '/',
    icon: homeCheckIcon,
    isOpened: false,
    isDisabled: true,
    group: 'top'
  },
  {
    name: 'tasks',
    title: 'Tasks',
    url: '/tasks',
    icon: checkCircleIcon,
    isOpened: true,
    isDisabled: false,
    group: 'top'
  },
  {
    name: 'notes',
    title: 'Notes',
    url: '/notes',
    icon: documentTextIcon,
    isOpened: false,
    isDisabled: true,
    group: 'top'
  },
  {
    name: 'settings',
    title: 'Settings',
    url: '/settings',
    icon: settingsIcon,
    isOpened: false,
    isDisabled: true,
    group: 'bottom'
  }
]
