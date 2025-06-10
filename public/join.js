async function joinSession(code, name) {
  const key = 'karaoke-mn-id-' + code;
  const storedId = localStorage.getItem(key);
  const res = await fetch('/sessions/' + encodeURIComponent(code) + '/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, deviceId: storedId || undefined })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem(key, data.deviceId);
    return data;
  } else {
    throw new Error(data.error || 'Join failed');
  }
}
