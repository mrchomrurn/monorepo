import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadFile(data: Blob, filename: string) {
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export type ExtractArrayStringValue<T extends readonly string[]> = T[number]

export function extractPlaceholderText(str: string) {
  if (!str) return ''

  const splitted = str.split(' ')

  if (splitted.length === 1)
    return str.substring(0, 1)

  return Array(2)
    .fill(0)
    .map(
      (_, i) =>
        splitted[i].split('').filter(c => /\p{L}/u.test(c))[0],
    )
    .join('')
}
