import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import ShopComingSoon from "./pages/ShopComingSoon";
import Quote from "./pages/Quote";
import Dashboard from "./pages/Dashboard";
import Admin from "@/pages/Admin";
import AdminUtilities from "@/pages/AdminUtilities";
import Gallery from "@/pages/Gallery";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductImageUpload from "@/pages/ProductImageUpload";
import AdminDataImport from "@/pages/AdminDataImport";
import AdminOrders from "@/pages/AdminOrders";
import ShippingPolicy from "@/pages/ShippingPolicy";
import ReturnPolicy from "@/pages/ReturnPolicy";
import Login from "@/pages/Login";
import ProductDetail from "@/pages/ProductDetail";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Refresh from "@/pages/Refresh";
import CabinetRefacing from "@/pages/services/CabinetRefacing";
import CabinetRepair from "@/pages/services/CabinetRepair";
import CountertopReplacement from "@/pages/services/CountertopReplacement";
import HardwareUpgrades from "@/pages/services/HardwareUpgrades";
import ClosetPantryDesign from "@/pages/services/ClosetPantryDesign";
import KitchenBathRemodeling from "@/pages/services/KitchenBathRemodeling";

/**
 * Scroll to the top of the document on every route change.
 *
 * Without this, navigating from the bottom of a long service page to another
 * page leaves the viewport mid-document, which reads as a broken page.
 */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/products"} component={Products} />
      <Route path={"/services"} component={Services} />
      {/* Dedicated SEO landing pages for each core service offering */}
      <Route path={"/services/cabinet-refacing"} component={CabinetRefacing} />
      <Route path={"/services/cabinet-repair"} component={CabinetRepair} />
      <Route
        path={"/services/countertop-replacement"}
        component={CountertopReplacement}
      />
      <Route path={"/services/hardware-upgrades"} component={HardwareUpgrades} />
      <Route path={"/services/closet-pantry-design"} component={ClosetPantryDesign} />
      <Route
        path={"/services/kitchen-bath-remodeling"}
        component={KitchenBathRemodeling}
      />
      {/* Quick-turn, lower-cost services landing page */}
      <Route path={"/refresh"} component={Refresh} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/shop/product/:id"} component={ProductDetail} />
      <Route path={"/quote"} component={Quote} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin-utilities"} component={AdminUtilities} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/checkout/success"} component={CheckoutSuccess} />
      <Route path={"/order-confirmation"} component={OrderConfirmation} />
      <Route path={"/shipping-policy"} component={ShippingPolicy} />
      <Route path={"/return-policy"} component={ReturnPolicy} />
      <Route path={"/login"} component={Login} />
        <Route path="/admin/product-images" component={ProductImageUpload} />
        <Route path="/admin/data-import" component={AdminDataImport} />
        <Route path="/admin/orders" component={AdminOrders} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
