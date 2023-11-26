import { z } from 'zod'

export const criteriaScheme = z.object({
  name: z.string().min(1, 'Nama kriteria harus diisi'),
})

export const subcriteriaScheme = z.object({
  poin: z.number().min(1, 'Poin harus diisi'),
  name: z.string().min(1, 'Nama subkriteria harus diisi'),
  criteriaId: z.string().min(1, 'Kriteria harus dipilih'),
  description: z.string().min(1, 'Deskripsi harus dipilih'),
})

export const studentScheme = z.object({
  nis: z.string().min(8, 'NIS harus 8 digit').max(8, 'NIS harus 8 digit'),
  name: z.string().min(1, 'Nama harus diisi').max(255),
  class: z.string().min(1, 'Kelas harus diisi').max(255),
  gender: z.string().min(1, 'Jenis kelamin harus diisi').max(255),
  address: z.string().max(65535),
  nameParent: z.string().min(1, 'Nama orangtua/wali harus diisi').max(255),
  phoneNumberParent: z
    .string()
    .regex(new RegExp('^[0-9]*$'), 'No HP tidak valid')
    .min(1, 'No HP orangtua/wali harus diisi')
    .max(255),
})

export const actionSchoolScheme = z.object({
  poinRange: z.number().array(),
  stack: z.string().min(1, 'Tingkatan stack harus diisi'),
  action: z.string().min(1, 'Tindakan sekolah harus diisi'),
  sanction: z.string().min(1, 'Sanksi harus diisi'),
})

export const offenseScheme = z.object({
  studentId: z.string().min(1, 'Siswa harus diisi'),
  criteriaId: z.string().min(1, 'Kriteria harus diisi'),
  subcriteriaId: z.string().min(1, 'Subkriteria harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi').max(65535),
  date: z.coerce.date(),
})
