var meta = document.querySelector('meta[name="archive-years"]');
var years = meta ? meta.getAttribute('content') : '';
document.getElementById('years').textContent = years || '';