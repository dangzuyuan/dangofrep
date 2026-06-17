import { useEffect, useRef, useCallback } from 'react';

var LOCK_THRESHOLD = 3;
var EDGE_PX = 30;
var FRICTION = 0.95;
var MIN_VELOCITY = 0.5;
var VELOCITY_SAMPLE_MS = 50;

/**
 * iOS 专属方向锁定：阻止右滑手势被页面级滚动/侧滑返回抢夺。
 * @param {React.Ref} scrollRef - ScrollArea DOM ref
 * @param {boolean} enabled - 仅 iOS 传入 true，Android 传 false 完全跳过
 */
export function useScrollLock(scrollRef, enabled) {
  var touchRef = useRef(null);
  var rafRef = useRef(null);

  var stopInertia = useCallback(function() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  var resetTouch = useCallback(function() {
    stopInertia();
    touchRef.current = null;
  }, [stopInertia]);

  useEffect(function() {
    // Android / 非 iOS：完全跳过，不注册任何监听
    if (!enabled) return;

    var el = scrollRef.current;
    if (!el) return;

    var handleTouchStart = function(e) {
      if (e.touches.length !== 1) {
        touchRef.current = null;
        return;
      }

      var touch = e.touches[0];

      // 跳过事件条触摸，避免与 useTouchCreate 冲突
      if (touch.target && touch.target.closest && touch.target.closest('[data-event-bar]')) {
        touchRef.current = null;
        return;
      }

      touchRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        prevX: touch.clientX,
        prevTime: Date.now(),
        lockedDir: null,
        velocities: [],
        edgeLocked: false
      };
    };

    var handleTouchMove = function(e) {
      if (!touchRef.current) return;
      if (e.touches.length !== 1) {
        touchRef.current = null;
        return;
      }

      var t = touchRef.current;
      var touch = e.touches[0];
      var now = Date.now();
      var dx = Math.abs(touch.clientX - t.startX);
      var dy = Math.abs(touch.clientY - t.startY);

      if (t.lockedDir === null) {
        if (!t.edgeLocked && t.startX <= EDGE_PX && touch.clientX > t.startX && dx >= 3) {
          t.lockedDir = 'horizontal';
          t.edgeLocked = true;
        } else if (dx > dy && dx >= LOCK_THRESHOLD) {
          t.lockedDir = 'horizontal';
        } else if (dy > dx && dy >= LOCK_THRESHOLD) {
          t.lockedDir = 'vertical';
        } else {
          return;
        }
      }

      if (t.lockedDir === 'horizontal') {
        e.preventDefault();
        var moveX = t.prevX - touch.clientX;
        el.scrollLeft += moveX;

        var dt = now - t.prevTime;
        if (dt > 0) {
          t.velocities.push({ vx: moveX / dt, time: now });
          while (t.velocities.length > 1 && now - t.velocities[0].time > VELOCITY_SAMPLE_MS) {
            t.velocities.shift();
          }
        }

        t.prevX = touch.clientX;
        t.prevTime = now;
      }
    };

    var handleTouchEnd = function() {
      if (!touchRef.current) return;

      var t = touchRef.current;

      if (t.lockedDir === 'horizontal' && t.velocities.length > 0) {
        var totalWeight = 0;
        var weightedVx = 0;
        t.velocities.forEach(function(sample) {
          var weight = sample.time - t.velocities[0].time + 1;
          weightedVx += sample.vx * weight;
          totalWeight += weight;
        });
        var velocity = totalWeight > 0 ? weightedVx / totalWeight : 0;

        if (Math.abs(velocity) > MIN_VELOCITY) {
          var lastTime = Date.now();
          var animate = function() {
            var now = Date.now();
            var elapsed = now - lastTime;
            lastTime = now;

            var frames = Math.max(1, Math.round(elapsed / 16));
            for (var i = 0; i < frames; i++) {
              velocity *= FRICTION;
            }

            if (Math.abs(velocity) < MIN_VELOCITY) {
              rafRef.current = null;
              return;
            }

            el.scrollLeft += velocity * (elapsed / 16);
            rafRef.current = requestAnimationFrame(animate);
          };
          rafRef.current = requestAnimationFrame(animate);
        }
      }

      touchRef.current = null;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return function() {
      stopInertia();
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [scrollRef, enabled, resetTouch, stopInertia]);
}
