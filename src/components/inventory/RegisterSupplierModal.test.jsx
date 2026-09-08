import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterSupplierModal from './RegisterSupplierModal'

vi.mock('../../lib/apiClient', () => ({
  getAuthContext: vi.fn(() => Promise.resolve({ token: 'tok', businessId: 'biz-1' })),
}))

const postSupplier = vi.fn(() => Promise.resolve({ id: 's-new' }))

vi.mock('../../lib/providersApi', () => ({
  postSupplier: (...args) => postSupplier(...args),
}))

const validForm = {
  name: 'Distribuidora Test',
  // Body >= 50.000.000 para pasar validateRutTypeConsistency como "comercial"
  // (default del formulario) — dígito verificador real (módulo 11).
  rut: '76.543.210-3',
  address: 'Av. Siempre Viva 742',
  category: 'Insumos',
  contact_name: 'Ana',
  phone: '+56 9 8765 4321',
  email: 'ana@test.cl',
}

function fillValidForm(user) {
  return user.type(screen.getByLabelText(/Nombre comercial/i), validForm.name)
    .then(() => user.type(screen.getByRole('textbox', { name: /RUT Comercial/i }), validForm.rut))
    .then(() => user.type(screen.getByLabelText(/Dirección/i), validForm.address))
    .then(() => user.type(screen.getByPlaceholderText(/Escribe la categoría/i), validForm.category))
    .then(() => user.keyboard('{Enter}'))
    .then(() => user.type(screen.getByLabelText(/^Contacto/i), validForm.contact_name))
    .then(() => user.type(screen.getByLabelText(/^Teléfono/i), validForm.phone))
    .then(() => user.type(screen.getByLabelText(/Correo electrónico/i), validForm.email))
}

describe('RegisterSupplierModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no renderiza cuando open es false', () => {
    // El drawer queda montado (se anima con clases CSS), no desmontado —
    // "cerrado" se verifica por las clases que lo sacan de la vista.
    render(<RegisterSupplierModal open={false} onClose={vi.fn()} businessId="biz-1" />)
    const heading = screen.getByRole('heading', { name: /Registro de Proveedores/i })
    const panel = heading.closest('div[style*="z-index: 501"]')
    expect(panel.className).toContain('translate-x-full')
  })

  it('muestra el formulario cuando open es true', () => {
    render(<RegisterSupplierModal open onClose={vi.fn()} businessId="biz-1" />)
    expect(screen.getByRole('heading', { name: /Registro de Proveedores/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Registrar$/i })).toBeInTheDocument()
  })

  it('muestra errores de validación si se envía vacío', async () => {
    const user = userEvent.setup()
    render(<RegisterSupplierModal open onClose={vi.fn()} businessId="biz-1" />)
    await user.click(screen.getByRole('button', { name: /Registrar$/i }))
    expect(await screen.findByText('Nombre comercial es obligatorio.')).toBeInTheDocument()
    expect(postSupplier).not.toHaveBeenCalled()
  })

  it('envía POST con datos válidos y cierra', async () => {
    const onClose = vi.fn()
    const onSuccess = vi.fn()
    const user = userEvent.setup()
    render(
      <RegisterSupplierModal open onClose={onClose} onSuccess={onSuccess} businessId="biz-99" />,
    )
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Registrar$/i }))

    await waitFor(() => {
      expect(postSupplier).toHaveBeenCalledTimes(1)
    })
    const [body] = postSupplier.mock.calls[0]
    expect(body.business_id).toBe('biz-99')
    expect(body.name).toBe(validForm.name)
    expect(body.rut).toBe('765432103')
    expect(onSuccess).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
