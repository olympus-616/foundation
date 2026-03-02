import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const ExecutiveSummary = lazy(() => import('./pages/ExecutiveSummary'));
const InvestmentStructure = lazy(() => import('./pages/InvestmentStructure'));
const FinancialModel = lazy(() => import('./pages/FinancialModel'));
const RedemptionAnalysis = lazy(() => import('./pages/RedemptionAnalysis'));
const TermSheet = lazy(() => import('./pages/TermSheet'));
const CapTable = lazy(() => import('./pages/CapTable'));
const InvestorFAQ = lazy(() => import('./pages/InvestorFAQ'));
const Appendix = lazy(() => import('./pages/Appendix'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-medium-gray font-sans text-sm">Loading...</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="executive-summary" element={<ExecutiveSummary />} />
            <Route path="investment-structure" element={<InvestmentStructure />} />
            <Route path="financial-model" element={<FinancialModel />} />
            <Route path="redemption" element={<RedemptionAnalysis />} />
            <Route path="term-sheet" element={<TermSheet />} />
            <Route path="cap-table" element={<CapTable />} />
            <Route path="faq" element={<InvestorFAQ />} />
            <Route path="appendix" element={<Appendix />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
