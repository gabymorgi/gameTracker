import { useRef } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  const storedRef = useRef<T>(
    localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key)!)
      : initialValue,
  )

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedRef.current) : value
      storedRef.current = valueToStore
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedRef.current, setValue] as const
}

export default useLocalStorage
