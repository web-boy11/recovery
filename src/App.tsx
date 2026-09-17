import { useEffect } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { initSessionTracking } from "./utils/sessionManager";
import { LanguageProvider } from "./context/LanguageContext";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AlertBanner from "./components/AlertBanner";
import QuickActions from "./components/QuickActions";
import About from "./components/About";
import RecoveryProcess from "./components/RecoveryProcess";
import FraudTypes from "./components/FraudTypes";
import ReportForm from "./components/ReportForm";
import Statistics from "./components/Statistics";
import Credentials from "./components/Credentials";
import FAQ from "./components/FAQ";
import Resources from "./components/Resources";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import ChatWidget from "./components/chat/ChatWidget";
import AdminLayout from "./components/admin/AdminLayout";

function PublicSite() {
  // Initialize session tracking (scroll position, cookies) on mount
  useEffect(() => {
    const cleanup = initSessionTracking();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <AlertBanner />
        <QuickActions />
        <About />
        <RecoveryProcess />
        <FraudTypes />
        <Statistics />
        <Credentials />
        <ReportForm />
        <FAQ />
        <Resources />
      </main>
      <Footer />

      {/* Official FBI Fraud Recovery Support Live Chat & Bot Widget */}
      <ChatWidget />

      {/* Cookie consent banner — shown on first visit */}
      <CookieConsent />
    </div>
  );
}

export default function App() {
  const page = useHashRoute();

  return (
    <LanguageProvider>
      {page === "admin" ? <AdminLayout /> : <PublicSite />}
    </LanguageProvider>
  );
}
