import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CoronaDesignProvider } from './contexts/CoronaDesignContext'
import { AppLayout } from './components/layout/AppLayout'
import SimpleHeader from './components/layout/SimpleHeader'
import HomePage from './pages/HomePage'
import WorkflowEditorPage from './pages/WorkflowEditorPage'
import WorkflowTemplatesPage from './pages/WorkflowTemplatesPage'
import AgentMarketplacePage from './pages/AgentMarketplacePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import DesignSystemTestPage from './pages/DesignSystemTestPage'
import SimpleTestPage from './pages/SimpleTestPage'
import TestComponentsPage from './pages/TestComponentsPage'
import TestWorkflowPageWithProvider from './pages/TestWorkflowPage'
import { CommunityPage } from './pages/CommunityPage'
import { ForumPostPage } from './pages/ForumPostPage'
import { TestCommunityPage } from './pages/TestCommunityPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProductOverviewPage from './pages/ProductOverviewPage'
import IntegrationsPage from './pages/IntegrationsPage'
import TemplatesPage from './pages/TemplatesPage'
import AIPage from './pages/AIPage'
import './App.css'

function AppRoutes() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  if (isHomePage || isAuthPage || location.pathname === '/privacy' || location.pathname === '/terms') {
    return (
      <>
        {isHomePage && <SimpleHeader />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
        </Routes>
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workflow" element={<WorkflowEditorPage />} />
        <Route path="/workflow/:id" element={<WorkflowEditorPage />} />
        <Route path="/workflow-templates" element={<WorkflowTemplatesPage />} />
        <Route path="/agents" element={<AgentMarketplacePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/product-overview" element={<ProductOverviewPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community-test" element={<TestCommunityPage />} />
        <Route path="/community/post/:postId" element={<ForumPostPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/design-test" element={<DesignSystemTestPage />} />
        <Route path="/simple-test" element={<SimpleTestPage />} />
        <Route path="/test-components" element={<TestComponentsPage />} />
        <Route path="/test-workflow" element={<TestWorkflowPageWithProvider />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" />
    </AppLayout>
  )
}

function App() {
  console.log('App is rendering with routes')
  
  return (
    <CoronaDesignProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </CoronaDesignProvider>
  )
}

export default App