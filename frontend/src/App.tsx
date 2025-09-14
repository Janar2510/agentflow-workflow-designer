import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AgentFlowDesignProvider } from './contexts/BrandDesignContext'
import { AppLayout } from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import WorkflowEditorPage from './pages/WorkflowEditorPage'
import WorkflowTemplatesPage from './pages/WorkflowTemplatesPage'
import AgentMarketplacePage from './pages/AgentMarketplacePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import DesignSystemTestPage from './pages/DesignSystemTestPage'
import SimpleTestPage from './pages/SimpleTestPage'
import { CommunityPage } from './pages/CommunityPage'
import { ForumPostPage } from './pages/ForumPostPage'
import { TestCommunityPage } from './pages/TestCommunityPage'
import './App.css'

function App() {
  console.log('App is rendering with routes')
  
  return (
    <AgentFlowDesignProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workflow" element={<WorkflowEditorPage />} />
            <Route path="/workflow/:id" element={<WorkflowEditorPage />} />
            <Route path="/templates" element={<WorkflowTemplatesPage />} />
            <Route path="/agents" element={<AgentMarketplacePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community-test" element={<TestCommunityPage />} />
            <Route path="/community/post/:postId" element={<ForumPostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/design-test" element={<DesignSystemTestPage />} />
            <Route path="/simple-test" element={<SimpleTestPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster position="top-right" />
        </AppLayout>
      </Router>
    </AgentFlowDesignProvider>
  )
}

export default App