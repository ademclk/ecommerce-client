import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SettingsLayoutProps {
    children: React.ReactNode
}

const sidebarNavItems = [
    {
        title: "Dashboard",
        href: "/admin",
    },
    {
        title: "Products",
        href: "/admin/products",
    },
    {
        title: "Customers",
        href: "/admin/customers",
    },
    {
        title: "Orders",
        href: "/admin/orders",
    },
]

export default function AdminLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <div>
                <div className="hidden space-y-6 p-10 pb-16 md:block">
                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <aside className="-mx-4 lg:w-1/6">
                            <SidebarNav items={sidebarNavItems} />
                        </aside>
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </div>
        </>
    )
}