export type NavItemChild = {
  title: string
  link: string
  type?: string
}

export type NavItem = {
  id: string
  title: string
  icon: string
  type?: string
  children: NavItemChild[] | null
}
