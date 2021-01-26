export type NavItemChild = {
  title: string
}

export type NavItem = {
  title: string
  icon: string
  children: NavItemChild[]
}
