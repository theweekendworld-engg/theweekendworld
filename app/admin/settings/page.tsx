'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: '',
    },
    siteTitle: '',
    siteDescription: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load settings from API
    // This would fetch from /api/settings
    setIsLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Save settings via API
    // await fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) })
    setIsSaving(false)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="github" className="block text-sm font-medium mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                id="github"
                value={settings.socialLinks.github}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, github: e.target.value },
                  })
                }
                className="w-full rounded-md border border-border bg-background px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                id="twitter"
                value={settings.socialLinks.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full rounded-md border border-border bg-background px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin"
                value={settings.socialLinks.linkedin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full rounded-md border border-border bg-background px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="siteTitle" className="block text-sm font-medium mb-2">
                Site Title
              </label>
              <input
                type="text"
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) =>
                  setSettings({ ...settings, siteTitle: e.target.value })
                }
                className="w-full rounded-md border border-border bg-background px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) =>
                  setSettings({ ...settings, siteDescription: e.target.value })
                }
                rows={3}
                className="w-full rounded-md border border-border bg-background px-4 py-2"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

