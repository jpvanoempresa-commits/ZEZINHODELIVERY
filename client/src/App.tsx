import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Restaurant from "./pages/Restaurant";
import Checkout from "./pages/Checkout";
import RestaurantPanel from "./pages/RestaurantPanel";
import DeliveryPanel from "./pages/DeliveryPanel";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import LoginPhone from "./pages/LoginPhone";
import Register from "./pages/Register";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/login-phone"} component={LoginPhone} />
      <Route path={"/register"} component={Register} />
      <Route path={"/search"} component={Search} />
      <Route path={"/restaurant/:id"} component={Restaurant} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/dashboard/restaurant"} component={RestaurantPanel} />
      <Route path={"/dashboard/delivery"} component={DeliveryPanel} />
      <Route path={"/dashboard/admin"} component={AdminPanel} />
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
