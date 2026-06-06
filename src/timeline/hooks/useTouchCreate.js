import { useState, useCallback, useRef, useEffect } from 'react';
import { pixelToMinutes, snapToGrid } from './utils';

export function useTouchCreate({ onSelectSlot, begintime, endtime, timejiange, maxSlots }) {
  var MAX_SLOTS = maxSlots || 8;
  var HOLD_MS = 300;

  var [isCreating, setIsCreating] = useState(false);
  var [createState, setCreateState] = useState(null);
  var touchRef = useRef(null);

  var configRef = useRef({ onSelectSlot, timejiange, begintime, endtime, maxSlots: MAX_SLOTS });
  useEffect(function() {
    configRef.current = { onSelectSlot, timejiange, begintime, endtime, maxSlots: MAX_SLOTS };
  }, [onSelectSlot, timejiange, begintime, endtime]);

  var cleanup = useCallback(function() {
    if (touchRef.current && touchRef.current.timer) {
      clearTimeout(touchRef.current.timer);
    }
    touchRef.current = null;
    setIsCreating(false);
    setCreateState(null);
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  }, []);

  var getTimeBounds = useCallback(function() {
    var sh = parseInt(begintime.split(':')[0], 10);
    var sm = parseInt(begintime.split(':')[1], 10);
    var eh = parseInt(endtime.split(':')[0], 10);
    var em = parseInt(endtime.split(':')[1], 10);
    return { minMinutes: sh * 60 + sm, maxMinutes: eh * 60 + em };
  }, [begintime, endtime]);

  var handleTouchStart = useCallback(function(e, resourceId) {
    if (e.touches && e.touches.length !== 1) return;
    if (touchRef.current) { cleanup(); return; }

    var touch = e.touches ? e.touches[0] : e;
    if (touch.target && touch.target.closest && touch.target.closest('[data-event-bar]')) return;

    var container = e.currentTarget.closest('[data-resource-column]');
    if (!container) return;

    var rect = container.getBoundingClientRect();
    var b = getTimeBounds();
    var totalMin = b.maxMinutes - b.minMinutes;
    var rawMin = pixelToMinutes(touch.clientY - rect.top, rect.height, totalMin);

    touchRef.current = {
      resourceId: resourceId,
      startClientY: touch.clientY,
      containerHeight: rect.height,
      totalMinutes: totalMin,
      minMinutes: b.minMinutes,
      maxMinutes: b.maxMinutes,
      startMin: rawMin,
      slotCount: 1,
      timer: null,
      started: false,
      active: false
    };

    var self = touchRef.current;
    self.timer = setTimeout(function() {
      if (!touchRef.current || touchRef.current !== self) return;
      self.active = true;
      self.started = true;
      self.startMin = snapToGrid(self.startMin, timejiange);
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      setIsCreating(true);
      setCreateState({
        resourceId: self.resourceId,
        startMin: self.startMin,
        endMin: self.startMin + timejiange
      });
    }, HOLD_MS);
  }, [getTimeBounds, timejiange, cleanup]);

  useEffect(function() {
    var handleTouchMove = function(e) {
      if (!touchRef.current || !touchRef.current.active) return;
      if (!e.touches || !e.touches.length) return;
      e.preventDefault();

      var t = touchRef.current;
      var touch = e.touches[0];
      var dy = touch.clientY - t.startClientY;

      if (dy < 0) return;

      var deltaMin = pixelToMinutes(Math.abs(dy), t.containerHeight, t.totalMinutes);
      var slots = Math.max(1, Math.min(MAX_SLOTS, Math.floor(deltaMin / configRef.current.timejiange) + 1));

      if (slots !== t.slotCount) {
        t.slotCount = slots;
        var endMin = t.startMin + slots * configRef.current.timejiange;
        endMin = Math.min(t.maxMinutes, endMin);
        t.slotCount = Math.floor((endMin - t.startMin) / configRef.current.timejiange);

        requestAnimationFrame(function() {
          if (!touchRef.current || touchRef.current !== t) return;
          setCreateState({
            resourceId: t.resourceId,
            startMin: t.startMin,
            endMin: t.startMin + t.slotCount * configRef.current.timejiange
          });
        });
      }
    };

    var handleTouchEnd = function() {
      if (!touchRef.current) return;

      if (touchRef.current.active && touchRef.current.slotCount >= 1) {
        var t = touchRef.current;
        var startMin = t.startMin;
        var endMin = startMin + t.slotCount * configRef.current.timejiange;

        if (configRef.current.onSelectSlot) {
          var absStart = t.minMinutes + startMin;
          var absEnd = t.minMinutes + endMin;

          var ft = function(m) {
            var h = Math.floor(m / 60).toString().padStart(2, '0');
            var mm = Math.floor(m % 60).toString().padStart(2, '0');
            return h + ':' + mm + ':00';
          };

          try {
            configRef.current.onSelectSlot({ type: 'CREATE', resourceId: t.resourceId, start: ft(absStart), end: ft(absEnd) });
          } catch (err) { console.error('[useTouchCreate] callback error:', err); }
        }
      }

      cleanup();
    };

    var handleTouchCancel = function() {
      cleanup();
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel);

    var handleBlur = function() { if (touchRef.current) cleanup(); };
    var handleVisibility = function() { if (document.hidden && touchRef.current) cleanup(); };
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    return function() {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [cleanup]);

  return { isCreating, createState, handleTouchStart };
}
