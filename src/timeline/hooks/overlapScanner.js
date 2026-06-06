export function scanColumnOverlap(resourceId, proposedStartMin, proposedEndMin, excludeEventId, containerHeight, totalMinutes) {
  var container = document.querySelector('[data-resource-id="' + resourceId + '"]');
  if (!container) return false;
  var cRect = container.getBoundingClientRect();
  var bars = container.querySelectorAll('[data-event-bar]');
  for (var i = 0; i < bars.length; i++) {
    var bar = bars[i];
    if (bar.dataset.eventId === excludeEventId) continue;
    if (bar.dataset.isBackground === 'true') continue;
    var rect = bar.getBoundingClientRect();
    var barStart = ((rect.top - cRect.top) / containerHeight) * totalMinutes;
    var barEnd = ((rect.bottom - cRect.top) / containerHeight) * totalMinutes;
    if (barStart < proposedEndMin && barEnd > proposedStartMin) return true;
  }
  return false;
}
