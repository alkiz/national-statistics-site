// DataNusa — dataset. Angka-angka dari publikasi BPS (diolah, 2026).
// Deret 2020–2024; bila suatu angka belum terverifikasi, angka itu tidak dipakai.
// Provinsi: 6 provinsi terpadat 2024 menurut BPS (GoodStats merangkum BPS, Sep 2024).
// Pangsa sektor PDB 2024: perkiraan dari pangsa yang dipublikasikan (jumlah 100%).
window.DATANUSA = {
  years: [2020, 2021, 2022, 2023, 2024],
  updated: 'November 2026',
  indicators: {
    penduduk: {
      label: 'Penduduk', unit: 'juta jiwa', decimals: 1,
      values: [270.2, 272.7, 275.8, 278.7, 281.6],
      note: 'Estimasi pertengahan tahun BPS; 2024: 281,6 juta jiwa.'
    },
    pdbNominal: {
      label: 'PDB nominal', unit: 'Rp triliun', decimals: 0,
      values: [15434, 16970, 19588.5, 20892.3, 22139.0],
      note: 'PDB atas dasar harga berlaku (ADHB).'
    },
    pdbTumbuh: {
      label: 'Pertumbuhan PDB', unit: '% (y-on-y)', decimals: 2,
      values: [-2.07, 3.70, 5.31, 5.05, 5.03],
      note: 'Pertumbuhan ekonomi tahunan; 2024 tumbuh 5,03%.'
    },
    pdbPerKapita: {
      label: 'PDB per kapita', unit: 'Rp juta', decimals: 1,
      values: [57.1, 62.2, 71.0, 75.0, 78.6],
      note: '2024: Rp78,6 juta (US$4.960,3). Tahun 2020–2023 dihitung dari PDB nominal dibagi penduduk.'
    },
    inflasi: {
      label: 'Inflasi (Des, y-on-y)', unit: '%', decimals: 2,
      values: [1.68, 1.87, 5.51, 2.61, 1.57],
      note: 'Inflasi Desember year-on-year; Des 2024 sebesar 1,57% — terendah dalam dua dekade di luar 2020–2021.'
    },
    tpt: {
      label: 'Tingkat pengangguran terbuka (Agu)', unit: '%', decimals: 2,
      values: [7.07, 6.49, 5.86, 5.32, 4.91],
      note: 'Sakernas Agustus; Agu 2024: 4,91% (7,47 juta penganggur).'
    },
    angkatanKerja: {
      label: 'Angkatan kerja (Agu)', unit: 'juta orang', decimals: 2,
      values: [138.22, 140.15, 143.72, 147.71, 152.11],
      note: 'Sakernas Agustus; Agu 2024: 152,11 juta orang, 144,64 juta di antaranya bekerja.'
    },
    kemiskinan: {
      label: 'Penduduk miskin (Mar)', unit: '%', decimals: 2,
      values: [9.78, 10.14, 9.54, 9.36, 9.03],
      note: 'Persentase penduduk miskin Maret; Sep 2024 turun ke 8,57% (24,06 juta jiwa) — terendah sepanjang sejarah pencatatan.'
    },
    gini: {
      label: 'Rasio gini (Mar)', unit: '', decimals: 3,
      values: [0.381, 0.384, 0.384, 0.388, 0.379],
      note: 'Ketimpangan pengeluaran Maret; Mar 2024: 0,379 (Mar 2023: 0,388).'
    },
    ipm: {
      label: 'Indeks Pembangunan Manusia', unit: '', decimals: 2,
      values: [72.81, 73.16, 73.77, 74.39, 75.02],
      note: 'IPM BPS; naik dari 72,81 (2020) ke 75,02 (2024).'
    }
  },
  // Provinsi terpadat 2024 (juta jiwa), BPS.
  provinces: [
    { name: 'Jawa Barat', pop: 50.35, share: 17.88 },
    { name: 'Jawa Timur', pop: 41.81, share: 14.85 },
    { name: 'Jawa Tengah', pop: 37.89, share: 13.46 },
    { name: 'Sumatera Utara', pop: 15.60, share: 5.54 },
    { name: 'Banten', pop: 12.43, share: 4.41 },
    { name: 'DKI Jakarta', pop: 10.68, share: 3.79 }
  ],
  // Pangsa PDB menurut lapangan usaha 2024 (%, perkiraan).
  sectors: [
    { name: 'Industri pengolahan', short: 'Industri', share: 18.7 },
    { name: 'Perdagangan', short: 'Perdagangan', share: 13.0 },
    { name: 'Pertanian, kehutanan & perikanan', short: 'Pertanian', share: 12.5 },
    { name: 'Konstruksi', short: 'Konstruksi', share: 9.9 },
    { name: 'Pertambangan & penggalian', short: 'Pertambangan', share: 8.4 },
    { name: 'Transportasi & pergudangan', short: 'Transportasi', share: 5.7 },
    { name: 'Jasa keuangan & asuransi', short: 'Jasa keuangan', share: 4.2 },
    { name: 'Informasi & komunikasi', short: 'Info & komunikasi', share: 4.1 },
    { name: 'Lapangan usaha lainnya', short: 'Lainnya', share: 23.5 }
  ],
  releases: [
    { date: '15 Jan 2025', title: 'Kemiskinan September 2024: 8,57%', body: 'Persentase penduduk miskin turun ke 8,57% (24,06 juta jiwa) — terendah sepanjang sejarah pencatatan BPS.' },
    { date: '5 Nov 2024', title: 'Ekonomi kuartal III-2024 tumbuh 4,95% (y-on-y)', body: 'PDB triwulan III-2024 atas dasar harga berlaku Rp5.638,9 triliun; pertumbuhan tahunan 2024 tercatat 5,03%.' },
    { date: '5 Nov 2024', title: 'Keadaan Ketenagakerjaan Agustus 2024', body: 'TPT Agustus 2024 sebesar 4,91%; angkatan kerja 152,11 juta orang dan 144,64 juta orang bekerja.' },
    { date: '15 Nov 2024', title: 'IPM 2024 mencapai 75,02', body: 'Indeks Pembangunan Manusia naik 0,63 poin dari 74,39 (2023) menjadi 75,02 (2024).' },
    { date: '2 Des 2024', title: 'Inflasi November 2024: 1,55% (y-on-y)', body: 'Inflasi Desember 2024 tercatat 1,57% (y-on-y) — terendah dalam dua dekade di luar 2020–2021.' },
    { date: '20 Sep 2024', title: 'Penduduk Indonesia 281,6 juta jiwa', body: 'BPS mencatat penduduk 281.603.900 jiwa per Juni 2024; Jawa Barat tetap provinsi terpadat (50,35 juta).' }
  ]
};
