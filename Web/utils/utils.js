import { supabase } from './supabase'
import axios from 'axios';

export function safeGet(promise, fallback = null) {
  return promise
    .then(res => res.data)
    .catch(() => fallback);
}

export async function getAuxTable(auxTable) {
  return await safeGet(axios.get(`http://localhost:3000/aux/${auxTable}`), []);
}

export function getStoragePathFromUrl(url) {
  if (!url) return null;

  const parts = url.split('/object/public/');
  if (parts.length < 2) return null;

  return parts[1].split('/').slice(1).join('/');
}


export async function uploadImageToSupabase(file, folder) {
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
