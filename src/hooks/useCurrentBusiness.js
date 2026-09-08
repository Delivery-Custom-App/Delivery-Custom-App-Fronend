import { useState, useEffect, useCallback } from 'react'
import { getBusiness, getOptionalAuthContext } from '../lib/apiClient'

/**
 * Datos del negocio del usuario autenticado (nombre, plan).
 * Solo resuelve algo para ADMIN_NEGOCIO — RLS bloquea /businesses/:id para otros roles.
 * @returns {object} { business, loading }
 */
export function useCurrentBusiness() {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchBusiness = useCallback(async () => {
    try {
      setLoading(true)
      const { token, businessId } = await getOptionalAuthContext()
      if (!token || !businessId) {
        setBusiness(null)
        return
      }
      const row = await getBusiness(businessId)
      setBusiness(row || null)
    } catch {
      setBusiness(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBusiness()
  }, [fetchBusiness])

  return { business, loading }
}
