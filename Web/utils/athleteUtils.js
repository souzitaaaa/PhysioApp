import { supabase } from './supabase'
import axios from 'axios';
import { safeGet } from './utils.js'

// Validate athlete form fields
export function validateAthleteForm(formData) {
  const errors = {}

  if (!formData.name?.trim()) errors.name = 'O nome é obrigatório'

  if (!formData.email?.trim()) errors.email = 'O email é obrigatório.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errors.email = 'O email não é válido.'

  if (!formData.phoneNumber && formData.phoneNumber !== 0)
    errors.phoneNumber = 'O número de telefone é obrigatório.'
  else if (!/^\+?\d{9,15}$/.test(String(formData.phoneNumber)))
    errors.phoneNumber = 'Número de telefone inválido.'

  if (!formData.birthdate) errors.birthdate = 'A data de nascimento é obrigatória.'

  if (!formData.countryID)
    errors.countryID = 'O País é obrigatório.'

  if (!formData.divisionID)
    errors.divisionID = 'A divisão é obrigatória.'

  return errors
}

// Validate accountable/responsible persons form
export function validateAccountableForm(accountableFormData = []) {
  if (!Array.isArray(accountableFormData)) {
    console.error('Expected an array for accountableFormData', accountableFormData)
    return { 0: { name: 'Dados inválidos', email: 'Dados inválidos', phoneNumber: 'Dados inválidos' } }
  }

  const errors = {}

    // Check if at least one accountable has data
  const hasAtLeastOneFilled = accountableFormData.some(element =>
    element.name?.trim() ||
    element.email?.trim() ||
    String(element.phoneNumber || '').trim() ||
    element.relationID
  )

  if (!hasAtLeastOneFilled) {
    errors[0] = {
      name: 'Pelo menos um responsável é obrigatório.',
      email: 'Pelo menos um responsável é obrigatório.',
      phoneNumber: 'Pelo menos um responsável é obrigatório.',
      relation: 'Obrigatório.'
    }
    return errors
  }

  // Validate each accountable individually
  accountableFormData.forEach((element, index) => {
    const itemErrors = {}
    const name = element.name?.trim()
    const email = element.email?.trim()
    const phone = String(element.phoneNumber || '').trim()
    const relation = element.relationID

    const hasAnyField = name || email || phone || relation

    if (hasAnyField) {
      if (!name) itemErrors.name = 'O nome é obrigatório.'
      if (!email) itemErrors.email = 'O email é obrigatório.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) itemErrors.email = 'O email não é válido.'
      if (!phone) itemErrors.phoneNumber = 'O número de telefone é obrigatório.'
      else if (!/^\+?\d{9,15}$/.test(phone)) itemErrors.phoneNumber = 'Número de telefone inválido.'
      if (!relation) itemErrors.relation = 'Obrigatório.'
    }

    if (Object.keys(itemErrors).length > 0) errors[index] = itemErrors
  })

  return errors
}

// Return empty athlete object
export function getEmptyAthlete() {
  return {
    name: '',
    birthdate: '',
    email: '',
    phoneNumber: '',
    pfp: '',
    countryID: '',
    divisionID: '',
  }
}

// Return two empty accountable objects
export function getEmptyAccountable(athleteID) {
  return [
    {
      name: '',
      email: '',
      phoneNumber: '',
      athleteID: athleteID ? athleteID : '',
      relationID: '',
    },
    {
      name: '',
      email: '',
      phoneNumber: '',
      athleteID: athleteID ? athleteID : '',
      relationID: '',
    },
  ]
}
