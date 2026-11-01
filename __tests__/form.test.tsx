import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LeadForm } from '@/components/lead-form'
test('unconfigured intake is explicit and cannot be submitted', () => {
  render(<LeadForm journey="website" enabled={false} />)
  expect(
    screen.getByRole('button', { name: 'Request submission unavailable' })
  ).toBeDisabled()
  expect(screen.getByText(/Intake is not connected/)).toBeInTheDocument()
})
test('self-check reveals qualified findings without submitting', () => {
  render(<LeadForm journey="visibility" enabled={false} />)
  fireEvent.click(
    screen.getByRole('button', { name: 'View my preliminary self-check' })
  )
  expect(screen.getByText('Preliminary observations')).toBeInTheDocument()
  expect(screen.getByText(/Evidence source: your answers/)).toBeInTheDocument()
})

test('confirmed response shows a request receipt, not an appointment', async () => {
  const original = global.fetch
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 'synthetic-test-id' }),
  })
  const { container } = render(<LeadForm journey="consulting" enabled={true} />)
  fireEvent.submit(container.querySelector('form')!)
  await waitFor(() =>
    expect(screen.getByText('REQUEST RECEIVED')).toBeInTheDocument()
  )
  expect(screen.getByText(/not a booked appointment/)).toBeInTheDocument()
  global.fetch = original
})
test('delivery error is announced without a success state', async () => {
  const original = global.fetch
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ message: 'Delivery unconfirmed' }),
  })
  const { container } = render(<LeadForm journey="website" enabled={true} />)
  fireEvent.submit(container.querySelector('form')!)
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent('Delivery unconfirmed')
  )
  expect(screen.queryByText('REQUEST RECEIVED')).not.toBeInTheDocument()
  global.fetch = original
})
