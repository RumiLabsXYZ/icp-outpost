import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./theme/ThemeProvider";
import { Layout } from "./components/layout/Layout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Overview } from "./pages/Overview";
import { Activity } from "./pages/Activity";
import { Health } from "./pages/Health";
import { EntityDetail } from "./pages/EntityDetail";

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Overview />} />
                <Route path="activity" element={<Activity />} />
                <Route path="health" element={<Health />} />
                {/* Generic entity route: /e/:type/:id */}
                <Route path="e/:type/:id" element={<EntityDetail />} />
                {/* Shorthand principal route from SearchBar */}
                <Route path="e/principal/:id" element={<EntityDetail />} />
                {/* Event detail */}
                <Route path="e/event/:id" element={<EntityDetail />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
