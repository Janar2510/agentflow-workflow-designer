import React, { useState } from 'react'
import { User, Settings, Shield, CreditCard, Palette, Bell } from 'lucide-react'
import { CoronaCard, CoronaButton } from '../components/ui'
import { useCoronaDesign } from '../hooks/useCoronaDesign'

const SettingsPage: React.FC = () => {
  const design = useCoronaDesign()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ]

  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: design.colors.bgPrimary,
    padding: design.spacing.lg,
    fontFamily: design.typography.fontFamily,
  }

  return (
    <div style={pageStyles}>
      {/* Header */}
      <div style={{ marginBottom: design.spacing.xl }}>
        <h1 style={{ 
          fontFamily: design.typography.fontFamily,
          fontSize: design.typography.sizes['3xl'],
          fontWeight: design.typography.weights.bold,
          margin: 0,
        }}>
          Settings
        </h1>
        <p style={{ 
          fontFamily: design.typography.fontFamily,
          fontSize: design.typography.sizes.base,
          marginTop: design.spacing.xs,
          margin: 0,
        }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CoronaCard variant="elevated" className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base,
                      display: 'flex',
                      alignItems: 'center',
                      gap: design.spacing.sm,
                      padding: `${design.spacing.sm} ${design.spacing.md}`,
                      borderRadius: design.spacing.xs,
                      backgroundColor: activeTab === tab.id ? design.colors.bgTertiary : 'transparent',
                      color: activeTab === tab.id ? design.colors.textPrimary : design.colors.textSecondary,
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease-in-out',
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </CoronaCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Information */}
              <CoronaCard variant="elevated" className="p-6">
                <h2 style={{ 
                  fontFamily: design.typography.fontFamily, fontWeight: design.typography.weights.bold, 
                  fontSize: design.typography.sizes.xl, 
                  marginBottom: design.spacing.lg 
                }}>
                  Profile Information
                </h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-20 h-20 flex items-center justify-center"
                    style={{ 
                      backgroundColor: design.colors.bgTertiary, 
                      borderRadius: '9999px' 
                    }}
                  >
                    <User className="h-8 w-8" style={{ color: design.colors.textMuted }} />
                  </div>
                  <div>
                    <CoronaButton variant="outline-primary" size="sm">
                      Change Avatar
                    </CoronaButton>
                    <p style={{ 
                      fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, 
                      marginTop: design.spacing.xs 
                    }}>
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={{ 
                      fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, fontWeight: design.typography.weights.medium, 
                      marginBottom: design.spacing.xs 
                    }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md"
                      style={{ 
                        backgroundColor: design.colors.bgTertiary, 
                        color: design.colors.textPrimary, 
                        border: `1px solid ${design.colors.borderPrimary}` 
                      }}
                      placeholder="Enter your first name"
                      defaultValue="John"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, fontWeight: design.typography.weights.medium, 
                      marginBottom: design.spacing.xs 
                    }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md"
                      style={{ 
                        backgroundColor: design.colors.bgTertiary, 
                        color: design.colors.textPrimary, 
                        border: `1px solid ${design.colors.borderPrimary}` 
                      }}
                      placeholder="Enter your last name"
                      defaultValue="Doe"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, fontWeight: design.typography.weights.medium, 
                      marginBottom: design.spacing.xs 
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 rounded-md"
                      style={{ 
                        backgroundColor: design.colors.bgTertiary, 
                        color: design.colors.textPrimary, 
                        border: `1px solid ${design.colors.borderPrimary}` 
                      }}
                      placeholder="Enter your email"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label style={{ 
                      fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, fontWeight: design.typography.weights.medium, 
                      marginBottom: design.spacing.xs 
                    }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 rounded-md"
                      style={{ 
                        backgroundColor: design.colors.bgTertiary, 
                        color: design.colors.textPrimary, 
                        border: `1px solid ${design.colors.borderPrimary}` 
                      }}
                      placeholder="Enter your phone number"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <CoronaButton variant="primary">
                    Save Changes
                  </CoronaButton>
                </div>
              </CoronaCard>

              {/* Account Settings */}
              <CoronaCard variant="elevated" className="p-6">
                <h2 style={{ 
                  fontFamily: design.typography.fontFamily, fontWeight: design.typography.weights.bold, 
                  fontSize: design.typography.sizes.xl, 
                  marginBottom: design.spacing.lg 
                }}>
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 style={{ 
                        fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base, 
                        fontWeight: design.typography.weights.medium, 
                        color: design.colors.textPrimary 
                      }}>Two-Factor Authentication</h3>
                      <p style={{ 
                        fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, 
                        marginTop: design.spacing.xs 
                      }}>Add an extra layer of security to your account</p>
                    </div>
                    <CoronaButton variant="outline-primary">
                      Enable
                    </CoronaButton>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 style={{ 
                        fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base, 
                        fontWeight: design.typography.weights.medium, 
                        color: design.colors.textPrimary 
                      }}>Email Notifications</h3>
                      <p style={{ 
                        fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, 
                        marginTop: design.spacing.xs 
                      }}>Receive updates about your workflows</p>
                    </div>
                    <CoronaButton variant="outline-primary">
                      Configure
                    </CoronaButton>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 style={{ 
                        fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base, 
                        fontWeight: design.typography.weights.medium, 
                        color: design.colors.textPrimary 
                      }}>Data Export</h3>
                      <p style={{ 
                        fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.sm, 
                        marginTop: design.spacing.xs 
                      }}>Download your data in various formats</p>
                    </div>
                    <CoronaButton variant="outline-primary">
                      Export
                    </CoronaButton>
                  </div>
                </div>
              </CoronaCard>
            </div>
          )}

          {activeTab === 'security' && (
            <CoronaCard variant="elevated" className="p-6">
              <h2 style={{ 
                fontFamily: design.typography.fontFamily, fontWeight: design.typography.weights.bold, 
                fontSize: design.typography.sizes.xl, 
                marginBottom: design.spacing.lg 
              }}>
                Security Settings
              </h2>
              <p style={{ fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base }}>
                Security settings will be available soon.
              </p>
            </CoronaCard>
          )}

          {activeTab === 'billing' && (
            <CoronaCard variant="elevated" className="p-6">
              <h2 style={{ 
                fontFamily: design.typography.fontFamily, fontWeight: design.typography.weights.bold, 
                fontSize: design.typography.sizes.xl, 
                marginBottom: design.spacing.lg 
              }}>
                Billing Settings
              </h2>
              <p style={{ fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base }}>
                Billing settings will be available soon.
              </p>
            </CoronaCard>
          )}

          {activeTab === 'appearance' && (
            <CoronaCard variant="elevated" className="p-6">
              <h2 style={{ 
                fontFamily: design.typography.fontFamily, fontWeight: design.typography.weights.bold, 
                fontSize: design.typography.sizes.xl, 
                marginBottom: design.spacing.lg 
              }}>
                Appearance Settings
              </h2>
              <p style={{ fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base }}>
                Appearance settings will be available soon.
              </p>
            </CoronaCard>
          )}

          {activeTab === 'notifications' && (
            <CoronaCard variant="elevated" className="p-6">
              <h2 style={{ 
                fontFamily: design.typography.fontFamily, fontWeight: design.typography.weights.bold, 
                fontSize: design.typography.sizes.xl, 
                marginBottom: design.spacing.lg 
              }}>
                Notification Settings
              </h2>
              <p style={{ fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base }}>
                Notification settings will be available soon.
              </p>
            </CoronaCard>
          )}

          {activeTab === 'preferences' && (
            <CoronaCard variant="elevated" className="p-6">
              <h2 style={{ 
                fontFamily: design.typography.fontFamily, fontWeight: design.typography.weights.bold, 
                fontSize: design.typography.sizes.xl, 
                marginBottom: design.spacing.lg 
              }}>
                Preferences
              </h2>
              <p style={{ fontFamily: design.typography.fontFamily, fontSize: design.typography.sizes.base }}>
                Preference settings will be available soon.
              </p>
            </CoronaCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage