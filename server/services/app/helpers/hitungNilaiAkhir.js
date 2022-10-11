function nilaiAkhir(uas, uts, ulangan, tugas) {
  const avgUlangan = ulangan.reduce((a, b) => a + b, 0) / tugas.length;
  const avgTugas = tugas.reduce((a, b) => a + b, 0) / tugas.length;
  const nilaiAkhir = 0.4 * uas + 0.3 * uts + 0.2 * avgUlangan + 0.1 * avgTugas;
  return { nilaiAkhir, uas, uts, ulangan: avgUlangan, tugas: avgTugas };
}

module.exports = nilaiAkhir