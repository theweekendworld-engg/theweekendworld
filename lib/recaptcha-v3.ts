// reCAPTCHA v3 utility

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export async function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => resolve())
      return
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) {
      reject(new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set'))
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    script.onload = () => {
      // Wait for grecaptcha to be ready
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          resolve()
        })
      } else {
        reject(new Error('reCAPTCHA failed to initialize'))
      }
    }
    script.onerror = () => {
      reject(new Error('Failed to load reCAPTCHA script'))
    }
    document.head.appendChild(script)
  })
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (!siteKey) {
    return null
  }

  try {
    // Load script if not already loaded
    if (!window.grecaptcha) {
      await loadRecaptchaScript()
    }

    // Wait for grecaptcha to be ready
    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action })
          resolve(token)
        } catch (error) {
          console.error('reCAPTCHA execution error:', error)
          resolve(null)
        }
      })
    })
  } catch (error) {
    console.error('reCAPTCHA load error:', error)
    return null
  }
}

