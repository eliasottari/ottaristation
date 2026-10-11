// ============================================================
//  BANDE-SON : musiques (ducking automatique sous la voix) + ambiances, calées sur les blocs (BT)
//  b(n) = début du bloc n (temps réel de la voix)
// ============================================================
SCENES.sort((a, b) => a.s - b.s);
const b = n => BT[n - 1];
const BEDS = [
  // musique
  { name: 'el:m_chase', t0: 0, t1: b(13) + .3, vol: .34, fin: .2, fout: 2 },
  { name: 'el:m_mystery', t0: b(13) - .5, t1: b(22) + .3, vol: .3, fin: 1.5, fout: 1.5 },
  { name: 'el:m_quirky', t0: b(22) - .5, t1: b(30) + .3, vol: .28, fin: 1.5, fout: 1.5 },
  { name: 'el:m_wonder', t0: b(30) - .5, t1: b(38) + .3, vol: .32, fin: 2, fout: 1.5 },
  { name: 'el:m_danger', t0: b(38) - .3, t1: b(54) + .3, vol: .34, fin: 1, fout: 1.5 },
  { name: 'el:m_wonder', t0: b(54) - .3, t1: b(60) + .2, vol: .3, fin: 1, fout: 1.5 },
  { name: 'el:m_danger', t0: b(60) - .3, t1: b(65) + .4, vol: .34, fin: .6, fout: 1.5 },
  { name: 'el:m_quirky', t0: b(65) - .4, t1: b(75) + .3, vol: .28, fin: 1.5, fout: 1.2 },
  { name: 'el:m_happy', t0: b(75) - .3, t1: b(84) + .4, vol: .3, fin: 1, fout: 2 },
  { name: 'el:m_mystery', t0: b(84) - .4, t1: b(89) + .2, vol: .3, fin: 1.5, fout: 1 },
  { name: 'el:m_suspense', t0: b(89) - .3, t1: b(92) + .5, vol: .22, fin: 1, fout: 1.5 },
  { name: 'el:m_underwater', t0: b(92) - .3, t1: b(95) + .3, vol: .3, fin: 1, fout: 1 },
  { name: 'el:m_suspense', t0: b(95) - .3, t1: b(117) + .3, vol: .36, fin: .5, fout: 1.2 },
  { name: 'el:m_wonder', t0: b(117) - .2, t1: b(125) + .5, vol: .36, fin: .8, fout: 2 },
  { name: 'el:m_emotional', t0: b(125) - .8, t1: b(145) + .5, vol: .34, fin: 2, fout: 2 },
  { name: 'el:m_mystery', t0: b(145) - .3, t1: b(151) + .5, vol: .3, fin: 1.5, fout: 1 },
  { name: 'el:m_suspense', t0: b(151) - .2, t1: b(174) + .2, vol: .32, fin: 1, fout: .6 },
  { name: 'el:m_sad', t0: b(174) - .2, t1: TOTAL, vol: .5, fin: 1.5, fout: 3 },
  // ambiances
  { name: 'el:a_beach', t0: 0, t1: b(13) + .2, vol: .2, duck: .2, fin: .3, fout: 1.5 },
  { name: 'el:a_sand', t0: b(13), t1: b(34) + .2, vol: .08, duck: .2, fin: 1.5, fout: 1.5 },
  { name: 'el:a_beach', t0: b(34), t1: b(58) + .2, vol: .22, duck: .2, fin: 1, fout: .8 },
  { name: 'el:a_underwater', t0: b(58), t1: b(119) + .3, vol: .14, duck: .2, fin: .5, fout: .8 },
  { name: 'el:a_beach', t0: b(119) + .3, t1: b(122) + .5, vol: .2, duck: .2, fin: .2, fout: 1 },
  { name: 'el:a_underwater', t0: b(122) + .3, t1: b(135) + .3, vol: .12, duck: .2, fin: 1, fout: 1 },
  { name: 'el:a_beach', t0: b(135), t1: b(145) + .2, vol: .18, duck: .2, fin: .5, fout: 1 },
  { name: 'el:a_night', t0: b(145), t1: b(174) + .2, vol: .3, duck: .2, fin: 1, fout: 1 },
  { name: 'el:a_underwater', t0: b(174), t1: TOTAL, vol: .12, duck: .2, fin: 1, fout: 3 },
];
