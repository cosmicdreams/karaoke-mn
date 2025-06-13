function getFairQueue(queue, singerStats = {}, phase2 = false) {
  const bySinger = {};
  queue.forEach((song, index) => {
    if (!bySinger[song.singer]) bySinger[song.singer] = [];
    bySinger[song.singer].push({ ...song, order: index });
  });

  const indexes = {};
  const counts = {};
  Object.keys(bySinger).forEach(s => {
    indexes[s] = 0;
    counts[s] = (singerStats[s] && singerStats[s].songsSung) || 0;
  });

  const result = [];
  while (result.length < queue.length) {
    let bestSinger = null;
    let bestScore = Infinity;
    let bestOrder = Infinity;
    for (const singer in bySinger) {
      if (indexes[singer] >= bySinger[singer].length) continue;
      const base = phase2 ? counts[singer] : Math.min(1, counts[singer]);
      const score = base + indexes[singer];
      const order = bySinger[singer][indexes[singer]].order;
      if (
        bestSinger === null ||
        score < bestScore ||
        (score === bestScore && order < bestOrder)
      ) {
        bestSinger = singer;
        bestScore = score;
        bestOrder = order;
      }
    }
    const song = bySinger[bestSinger][indexes[bestSinger]];
    indexes[bestSinger]++;
    result.push(song);
  }
  return result;
}

export { getFairQueue };
