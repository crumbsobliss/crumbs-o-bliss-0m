
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Pizza, 
  Gift, 
  Image as ImageIcon, 
  LogOut, 
  Menu,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'manager')) {
    // If user is not admin/manager, redirect to home
    redirect(`/${locale}/`)
  }

  const isManager = profile.role === 'manager'

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-border/50 bg-card sm:flex">
        <div className="flex h-16 items-center px-6 border-b border-border/40">
          <Link href={`/${locale}/admin`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">C</div>
            <span className="font-bold text-sm tracking-tight text-foreground">Admin Panel</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Main Menu</div>
          <nav className="space-y-1">
            <Link
              href={`/${locale}/admin`}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted group"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span>Overview</span>
              </div>
              <ChevronRight className="h-3.3 w-3.2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            {!isManager && (
              <>
                <Link
                  href={`/${locale}/admin/products`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted group"
                >
                  <div className="flex items-center gap-3">
                    <Pizza className="h-4 w-4 text-primary" />
                    <span>Menu Items</span>
                  </div>
                  <ChevronRight className="h-3.3 w-3.2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href={`/${locale}/admin/catalogues`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted group"
                >
                  <div className="flex items-center gap-3">
                    <Gift className="h-4 w-4 text-primary" />
                    <span>Special Packs</span>
                  </div>
                  <ChevronRight className="h-3.3 w-3.2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href={`/${locale}/admin/special-images`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted group"
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Page Images</span>
                  </div>
                  <ChevronRight className="h-3.3 w-3.2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </>
            )}
            
            <Link
              href={`/${locale}/admin/orders`}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted group"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>Orders</span>
              </div>
              <ChevronRight className="h-3.3 w-3.2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </nav>

          <div className="mt-8">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Shortcut</div>
            <Link
                href={`/${locale}`}
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted text-muted-foreground hover:text-foreground"
            >
                <ExternalLink className="h-4 w-4" />
                <span>View Website</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t border-border/40 bg-muted/30">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 w-full group">
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">

          {/* Mobile Navigation Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="sm:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] flex flex-col p-6">
              <SheetTitle className="text-xl font-bold mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">C</div>
                Admin Panel
              </SheetTitle>
              
              <nav className="flex flex-col gap-2 flex-1">
                <Link
                  href={`/${locale}/admin`}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
                >
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  Overview
                </Link>
                {!isManager && (
                  <>
                    <Link
                      href={`/${locale}/admin/products`}
                      className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
                    >
                      <Pizza className="h-5 w-5 text-primary" />
                      Menu Items
                    </Link>
                    <Link
                      href={`/${locale}/admin/catalogues`}
                      className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
                    >
                      <Gift className="h-5 w-5 text-primary" />
                      Special Packs
                    </Link>
                    <Link
                      href={`/${locale}/admin/special-images`}
                      className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
                    >
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Page Images
                    </Link>
                  </>
                )}
                <Link
                  href={`/${locale}/admin/orders`}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
                >
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Orders
                </Link>
              </nav>

              <div className="mt-auto space-y-4 pt-6 border-t">
                <Link
                    href={`/${locale}`}
                    className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium text-muted-foreground"
                >
                    <ExternalLink className="h-5 w-5" />
                    Visit Website
                </Link>
                <form action="/auth/signout" method="post">
                  <button className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-red-50 text-red-500 transition-colors font-medium w-full text-left">
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </form>
              </div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">Access Level</p>
                <p className="text-xs font-semibold text-primary capitalize">{profile.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full max-w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
