import { supabase } from './supabase'
import axios from 'axios';
import { safeGet } from './utils.js'

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

  if (!formData.nationality?.trim()) errors.nationality = 'A nacionalidade é obrigatória.'

  if (!formData.divisionID)
    errors.divisionID = 'A divisão é obrigatória.'

  return errors
}

export function validateAccountableForm(accountableFormData = []) {
  if (!Array.isArray(accountableFormData)) {
    console.error('Expected an array for accountableFormData', accountableFormData)
    return { 0: { name: 'Dados inválidos', email: 'Dados inválidos', phoneNumber: 'Dados inválidos' } }
  }

  const errors = {}

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

export function getEmptyAthlete() {
  return {
    name: '',
    birthdate: '',
    email: '',
    phoneNumber: '',
    pfp: '',
    nationality: '',
    divisionID: '',
  }
}

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

export async function uploadImageToSupabase(file, folder = 'athlete-images') {
  if (!file) return null

  const extMatch = file.name.match(/(\.[^.]*)$/)
  const ext = extMatch ? extMatch[1].toLowerCase() : '.jpg'
  let base = file.name.replace(extMatch ? extMatch[0] : '', '')

  base = base
    .normalize('NFD') // remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_') // spaces -> underscores
    .replace(/[^a-zA-Z0-9._-]/g, '_') // only valid chars
    .replace(/_+/g, '_') // collapse underscores
    .replace(/^_+|_+$/g, '') // trim underscores

  if (base.length > 150) base = base.slice(0, 150)

  const fileName = `${Date.now()}_${base}${ext}`

  // Upload
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(folder)
    .upload(fileName, file)

  if (uploadError) {
    console.error('Erro no upload da imagem:', uploadError)
    return null
  }

  const { data: publicUrlData } = supabase.storage.from(folder).getPublicUrl(fileName)

  return publicUrlData?.publicUrl || null
}
