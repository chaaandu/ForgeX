declare global {
  interface Window {
    /** Set by NavWatcher once the user has navigated inside the app. */
    __forgexNavigated?: boolean
  }
}

export {}
