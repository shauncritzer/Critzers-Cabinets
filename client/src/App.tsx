import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/products"} component={Products} />
      <Route path={"/services"} component={Services} />
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
