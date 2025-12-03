import { supabase } from './supabase'

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

export async function getAuxDivisionData() {
  const { data, error } = await supabase.from('taux_division').select()

  if (error) return []
  return data
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
