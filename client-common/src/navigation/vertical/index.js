import { domainPermission, viewAccess } from '@/utils/utils'
var permission = domainPermission('Common');

var navMenu = [];
var menu = [
  {
    title: 'Dashboard',
    route: 'dashboard',
    icon: 'ActivityIcon',
  },
  {
    title: 'Item',
    icon: 'PackageIcon',
    isMainMenu: true,
    route: 'item',
    children: [
  {
    title: 'Cable',
    icon: 'BoxIcon',
    route: 'item',
  },
      {
        title: 'Component',
        route: 'component',
        icon: 'PackageIcon',
      },
      {
        title: 'Drum',
        route: 'bom',
        icon: 'PackageIcon',
      },
    ],
  },
  {
    title: 'Plant',
    icon: 'HomeIcon',
    route: 'plant',
    isMainMenu: true,
    children: [
      {
        title: 'Hardware',
        route: 'hardware',
        icon: 'ToolIcon',
      },
      {
        title: 'Station/ PL',
        route: 'station',
        icon: 'HomeIcon',
      },
    ],
  },
  {
    title: 'Role',
    route: 'role',
    icon: 'SettingsIcon'
  },
  {
    title: 'User',
    route: 'user',
    icon: 'UsersIcon',
  },
]

if (permission.allAccess) {
  navMenu = [...menu]
} else {
  var userAccess = viewAccess()

  menu.forEach(el => {
    if (userAccess.includes(el.route)) {
      navMenu.push(el)
    }
  })
}

// navMenu.push({
//   title: 'OEE',
//   route: 'oee',
//   icon: "TargetIcon"
// })

export default navMenu