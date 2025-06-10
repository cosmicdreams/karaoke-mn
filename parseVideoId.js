function parseVideoId(input) {
  if (!input) return null;
  if (/^[\w-]{11}$/.test(input)) return input;
  const vParam = input.match(/[?&]v=([\w-]{11})/);
  if (vParam) return vParam[1];
  const short = input.match(/youtu\.be\/([\w-]{11})/);
  if (short) return short[1];
  const embed = input.match(/embed\/([\w-]{11})/);
  if (embed) return embed[1];
  return null;
}

module.exports = { parseVideoId };
