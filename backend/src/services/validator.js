export function validateInput(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message must be a non-empty string' }
  }

  if (message.trim().length < 5) {
    return { valid: false, error: 'Message too short (minimum 5 characters)' }
  }

  if (message.length > 5000) {
    return { valid: false, error: 'Message too long (maximum 5000 characters)' }
  }

  return { valid: true }
}

export function sanitizeInput(message) {
  return message.trim().substring(0, 5000)
}
