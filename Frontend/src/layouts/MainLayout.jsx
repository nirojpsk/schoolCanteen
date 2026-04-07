import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function MainLayout() {
    return (
        <div className="relative min-h-screen overflow-hidden text-slate-900">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem] bg-[radial-gradient(circle_at_top,_rgba(18,114,82,0.18),_transparent_62%)]" />
            <div className="pointer-events-none absolute right-[-7rem] top-32 -z-10 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
            <div className="pointer-events-none absolute left-[-6rem] top-[28rem] -z-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="pointer-events-none absolute right-[8%] top-[38rem] -z-10 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-[14rem] -z-10 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
            <Navbar />
            <main className="pb-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
