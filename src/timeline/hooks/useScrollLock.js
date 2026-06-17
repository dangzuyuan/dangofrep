import { useEffect, useRef, useCallback } from 'react';

// ============================================================
// iOS 常量
// ============================================================
var IOS_LOCK_THRESHOLD = 3;       // 极低阈值，提前上锁
var IOS_EDGE_PX = 30;             // 左边缘敏感区
var FRICTION = 0.95;              // 动量摩擦系数
var MIN_VELOCITY = 0.5;           // 低于此值停止惯性
var VELOCITY_SAMPLE_MS = 50;      // 速度采样窗口

// ============================================================
// Android 常量
// ============================================================
var ANDROID_LOCK_THRESHOLD = 5;   // 原生识别足够，无需过早锁

// ============================================================
// useScrollLock — iOS/Android 双分支滑动锁定
// ============================================================
export function useScrollLock(scrollRef, isIOS) {
  var touchRef = useRef(null);
  var rafRef = useRef(null);
  var docGuardRef = useRef(null);

  // ---- iOS 辅助函数 ----
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

  // iOS：全局 document 守卫，仅横向手势拦截
  var addDocGuard = useCallback(function() {
    if (docGuardRef.current) return;  // 已存在
    var guard = function(e) {
      if (touchRef.current && touchRef.current.lockedDir === 'horizontal') {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      // 纵向 / 未锁定：不拦截，原生正常滚动
    };
    docGuardRef.current = guard;
    // capture:true 保证在冒泡阶段之前执行，优先于其他组件
    document.addEventListener('touchmove', guard, { passive: false, capture: true });
  }, []);

  var resetIOS = useCallback(function() {
    stopInertia();
    removeDocGuard();
    touchRef.current = null;
  }, [stopInertia, removeDocGuard]);

  // ---- Android 辅助函数 ----
  var resetAndroid = useCallback(function() {
    touchRef.current = null;
  }, []);

  // ============================================================
  // 主 Effect
  // ============================================================
  useEffect(function() {
    var el = scrollRef.current;
    if (!el) return;

    // ------------------------ 通用 touchstart ------------------------
    var handleTouchStart = function(e) {
      // 多指不锁定
      if (e.touches.length !== 1) {
        touchRef.current = null;
        return;
      }

      var touch = e.touches[0];

      // 跳过事件条触摸，避免与 useTouchCreate 冲突（两平台共用）
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
        // iOS 专属字段
        velocities: isIOS ? [] : null,
        edgeLocked: isIOS ? false : null
      };

      // iOS：触摸开始即挂载全局守卫，保证第一帧 touchmove 就有拦截
      if (isIOS) addDocGuard();
    };

    // ------------------------ 通用 touchmove ------------------------
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

      // --- 方向锁定（iOS 和 Android 公用判定逻辑）---
      if (t.lockedDir === null) {
        if (isIOS) {
          // iOS：边缘预判 + 普通判定
          if (!t.edgeLocked && t.startX <= IOS_EDGE_PX && touch.clientX > t.startX && dx >= 1) {
            t.lockedDir = 'horizontal';
            t.edgeLocked = true;
          } else if (dx > dy && dx >= IOS_LOCK_THRESHOLD) {
            t.lockedDir = 'horizontal';
          } else if (dy > dx && dy >= IOS_LOCK_THRESHOLD) {
            t.lockedDir = 'vertical';
          } else {
            return;
          }
        } else {
          // Android：仅基础方向判定
          if (dx > dy && dx >= ANDROID_LOCK_THRESHOLD) {
            t.lockedDir = 'horizontal';
          } else if (dy > dx && dy >= ANDROID_LOCK_THRESHOLD) {
            t.lockedDir = 'vertical';
          } else {
            return;
          }
        }
      }

      // --- 横向锁定后处理 ---
      if (t.lockedDir === 'horizontal') {
        e.preventDefault();

        if (isIOS) {
          // iOS：手动控制 scrollLeft + 速度采样
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
        // Android：仅 preventDefault，scrollLeft 交给原生 overflow
      }
    };

    // ------------------------ 通用 touchend ------------------------
    var handleTouchEnd = function() {
      if (!touchRef.current) return;

      var t = touchRef.current;

      if (isIOS && t.lockedDir === 'horizontal' && t.velocities && t.velocities.length > 0) {
        // iOS：rAF 动量惯性动画
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

        resetIOS();
      } else if (isIOS) {
        resetIOS();
      } else {
        resetAndroid();
      }
    };

    // ---- 注册监听 ----
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });  // 滑动中断统一清理

    // ---- 清理 ----
    return function() {
      stopInertia();
      removeDocGuard();
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [scrollRef, isIOS, resetIOS, resetAndroid, stopInertia, removeDocGuard, addDocGuard]);
}
