export default {
  setStore(key: string, value: string) {
    localStorage.setItem(key, value)
  },
  async getStore(key: string) {
    return localStorage.getItem(key)
  },
}
