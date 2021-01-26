export type NavItemChild = {
  title: string
}

export type NavItem = {
  id: string
  title: string
  icon: string
  children: NavItemChild[] | null
}
