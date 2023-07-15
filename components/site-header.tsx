import { MainNav } from "./main-nav";

export default function SiteHeader() {
    return (
        <>
            <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/30 backdrop-blur">
                <div className="container flex h-14 items-center">
                    <MainNav />
                </div>
            </header>
        </>
    )
}