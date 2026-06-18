import { useEffect, useRef, useCallback } from 'react';

// ============================================================
// iOS 常量
// ============================================================
var LOCK_THRESHOLD = 3;       // 极低阈值，提前上锁
var EDGE_PX = 30;             // 左边缘敏感区
var FRICTION = 0.95;          // 动量摩擦系数
var MIN_VELOCITY = 0.5;       // 低于此值停止惯性
var VELOCITY_SAMPLE_MS = 50;  // 速度采样窗口

// ============================================================
// useScrollLock — iOS/Android 双分支滑动锁定
//   isIOS=true  → iOS 完整逻辑（全局守卫+手动scrollLeft+动量）
//   isIOS=false → Android 完全跳过（零监听，不干扰原生滚动）
// ============================================================
export function useScrollLock(scrollRef, isIOS) {
  var touchRef = useRef(null);
  var rafRef = useRef(null);
  var docGuardRef = useRef(null);

  // ---- 辅助函数 ----
  var stopInertia = useCallback(function() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  var removeDocGuard = useCallback(function() {
    if (docGuardRef.current) {
      document.removeEventListener('touchmove', docGuardRef.current, true);
      docGuardRef.current = null;
    }
  }, []);

  var addDocGuard = useCallback(function() {
    if (docGuardRef.current) return;
    var guard = function(e) {
      if (touchRef.current && touchRef.current.lockedDir === 'horizontal') {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    docGuardRef.current = guard;
    document.addEventListener('touchmove', guard, { passive: false, capture: true });
  }, []);

  var reset = useCallback(function() {
    stopInertia();
    removeDocGuard();
    touchRef.current = null;
  }, [stopInertia, removeDocGuard]);

  // ============================================================
  // 主 Effect — 仅 iOS 生效
  // ============================================================
  useEffect(function() {
    // Android：不注册任何 JS 监听，零干扰原生 overflow: auto 滚动
    if (!isIOS) return;

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

      // iOS：触摸开始即挂载全局 document 守卫
      addDocGuard();
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
        if (!t.edgeLocked && t.startX <= EDGE_PX && touch.clientX > t.startX && dx >= 1) {
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
        e.stopImmediatePropagation();
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

      reset();
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return function() {
      stopInertia();
      removeDocGuard();
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [scrollRef, isIOS, reset, stopInertia, removeDocGuard, addDocGuard]);
}
