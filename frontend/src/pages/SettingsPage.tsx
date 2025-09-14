import React, { useState } from 'react'
import { User, Settings, Shield, CreditCard, Palette, Bell } from 'lucide-react'

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#ffffff',
          margin: 0
        }}>
          Settings
        </h1>
        <p style={{ 
          marginTop: '0.25rem',
          color: '#a0a9c0',
          margin: 0
        }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="af-card--animated-border p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'af-bg-primary af-text-primary'
                        : 'af-text-secondary hover:af-bg-glass hover:af-text-primary'
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? '#007AFF' : 'transparent',
                      color: activeTab === tab.id ? '#ffffff' : '#a0a9c0'
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="af-card--animated-border p-6">
                <h2 className="af-text-xl af-font-semibold af-text-primary mb-6">
                  Profile Information
                </h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-20 h-20 af-bg-tertiary af-radius-full flex items-center justify-center"
                    style={{ backgroundColor: '#16213e' }}
                  >
                    <User className="h-8 w-8 af-text-muted" />
                  </div>
                  <div>
                    <button className="af-btn af-btn--ghost">
                      Change Avatar
                    </button>
                    <p className="af-text-xs af-text-muted mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block af-text-sm af-font-medium af-text-primary mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="af-input w-full"
                      placeholder="Enter your first name"
                      defaultValue="John"
                    />
                  </div>
                  <div>
                    <label className="block af-text-sm af-font-medium af-text-primary mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="af-input w-full"
                      placeholder="Enter your last name"
                      defaultValue="Doe"
                    />
                  </div>
                  <div>
                    <label className="block af-text-sm af-font-medium af-text-primary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="af-input w-full"
                      placeholder="Enter your email"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block af-text-sm af-font-medium af-text-primary mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="af-input w-full"
                      placeholder="Enter your phone number"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="af-btn af-btn--primary">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Account Settings */}
              <div className="af-card--animated-border p-6">
                <h2 className="af-text-xl af-font-semibold af-text-primary mb-6">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="af-font-medium af-text-primary">Two-Factor Authentication</h3>
                      <p className="af-text-sm af-text-secondary">Add an extra layer of security to your account</p>
                    </div>
                    <button className="af-btn af-btn--ghost">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="af-font-medium af-text-primary">Email Notifications</h3>
                      <p className="af-text-sm af-text-secondary">Receive updates about your workflows</p>
                    </div>
                    <button className="af-btn af-btn--ghost">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="af-font-medium af-text-primary">Data Export</h3>
                      <p className="af-text-sm af-text-secondary">Download your data in various formats</p>
                    </div>
                    <button className="af-btn af-btn--ghost">
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="af-card--animated-border p-6">
              <h2 className="af-text-xl af-font-semibold af-text-primary mb-6">
                Security Settings
              </h2>
              <p className="af-text-secondary">
                Security settings will be available soon.
              </p>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="af-card--animated-border p-6">
              <h2 className="af-text-xl af-font-semibold af-text-primary mb-6">
                Billing Settings
              </h2>
              <p className="af-text-secondary">
                Billing settings will be available soon.
              </p>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="af-card--animated-border p-6">
              <h2 className="af-text-xl af-font-semibold af-text-primary mb-6">
                Appearance Settings
              </h2>
              <p className="af-text-secondary">
                Appearance settings will be available soon.
              </p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="af-card--animated-border p-6">
              <h2 className="af-text-xl af-font-semibold af-text-primary mb-6">
                Notification Settings
              </h2>
              <p className="af-text-secondary">
                Notification settings will be available soon.
              </p>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="af-card--animated-border p-6">
              <h2 className="af-text-xl af-font-semibold af-text-primary mb-6">
                Preferences
              </h2>
              <p className="af-text-secondary">
                Preference settings will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage