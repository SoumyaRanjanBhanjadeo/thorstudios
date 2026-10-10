export const PRIVACY_EVENT = 'thor:privacy'
export const COOKIE_STORAGE_KEY = 'thor-studios-cookies'

export function openPrivacyPolicy() {
  window.dispatchEvent(new Event(PRIVACY_EVENT))
}

export function readCookieConsent() {
  try {
    return window.localStorage.getItem(COOKIE_STORAGE_KEY)
  } catch {
    return null
  }
}

export function writeCookieConsent(value) {
  try {
    window.localStorage.setItem(COOKIE_STORAGE_KEY, value)
  } catch {
    /* ignore */
  }
}
