import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Quote from "./pages/Quote";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Gallery from "./pages/Gallery";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductImageUpload from "@/pages/ProductImageUpload";
import AdminDataImport from "@/pages/AdminDataImport";
import Login from "@/pages/Login";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/quote"} component={Quote} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/order-confirmation"} component={OrderConfirmation} />
      <Route path={"/login"} component={Login} />
        <Route path="/admin/product-images" component={ProductImageUpload} />
        <Route path="/admin/data-import" component={AdminDataImport} />
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
