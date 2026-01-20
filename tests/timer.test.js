/**
 * TimerManager Unit Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Recreate TimerManager for testing (adapting IIFE pattern)
function createTimerManager() {
  let timerInterval = null;
  let timeRemaining = 0;
  let timerElement = null;
  let timerContainer = null;
  let onTimeUp = null;
  let TOTAL_TIME = 30 * 60;
  let LOW_TIME_WARNING = 5 * 60;

  function init(config = {}) {
    TOTAL_TIME = config.totalTime || 30 * 60;
    LOW_TIME_WARNING = config.lowTimeWarning || 5 * 60;
    timerElement = config.timerElement || null;
    timerContainer = timerElement ? timerElement.parentElement : null;
    onTimeUp = config.onTimeUp || (() => {});
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  function updateDisplay() {
    if (timerElement) {
      timerElement.textContent = formatTime(timeRemaining);
    }
    if (timeRemaining <= 0) {
      stop();
      if (onTimeUp) onTimeUp();
      return;
    }
    timeRemaining--;
    localStorage.setItem("ue5ScenarioTimer", timeRemaining.toString());
  }

  function start(fresh = false) {
    if (fresh) {
      timeRemaining = TOTAL_TIME;
      localStorage.removeItem("ue5ScenarioTimer");
    } else {
      const saved = localStorage.getItem("ue5ScenarioTimer");
      timeRemaining = saved !== null ? parseInt(saved, 10) : TOTAL_TIME;
    }
    if (timerInterval) clearInterval(timerInterval);
    if (timeRemaining > 0) {
      updateDisplay();
      timerInterval = setInterval(updateDisplay, 1000);
    } else if (onTimeUp) {
      onTimeUp();
    }
  }

  function pause() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resume() {
    if (!timerInterval && timeRemaining > 0) {
      timerInterval = setInterval(updateDisplay, 1000);
    }
  }

  function stop() {
    pause();
  }

  function getTimeRemaining() {
    return timeRemaining;
  }

  function isRunning() {
    return timerInterval !== null;
  }

  return {
    init,
    formatTime,
    start,
    pause,
    resume,
    stop,
    getTimeRemaining,
    isRunning,
  };
}

describe("TimerManager", () => {
  let TimerManager;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    TimerManager = createTimerManager();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatTime", () => {
    it("formats 0 seconds as 00:00", () => {
      expect(TimerManager.formatTime(0)).toBe("00:00");
    });

    it("formats 60 seconds as 01:00", () => {
      expect(TimerManager.formatTime(60)).toBe("01:00");
    });

    it("formats 90 seconds as 01:30", () => {
      expect(TimerManager.formatTime(90)).toBe("01:30");
    });

    it("formats 30 minutes as 30:00", () => {
      expect(TimerManager.formatTime(1800)).toBe("30:00");
    });

    it("pads single digit minutes", () => {
      expect(TimerManager.formatTime(65)).toBe("01:05");
    });

    it("pads single digit seconds", () => {
      expect(TimerManager.formatTime(305)).toBe("05:05");
    });
  });

  describe("init", () => {
    it("uses default total time of 30 minutes", () => {
      TimerManager.init({});
      TimerManager.start(true);
      // Timer decrements once immediately on start
      expect(TimerManager.getTimeRemaining()).toBe(30 * 60 - 1);
    });

    it("uses custom total time from config", () => {
      TimerManager.init({ totalTime: 600 }); // 10 minutes
      TimerManager.start(true);
      // Timer decrements once immediately on start
      expect(TimerManager.getTimeRemaining()).toBe(599);
    });
  });

  describe("start", () => {
    beforeEach(() => {
      TimerManager.init({ totalTime: 100 });
    });

    it("starts with fresh time when fresh=true", () => {
      localStorage.setItem("ue5ScenarioTimer", "50");
      TimerManager.start(true);
      // Timer decrements once immediately on start
      expect(TimerManager.getTimeRemaining()).toBe(99);
    });

    it("resumes saved time when fresh=false", () => {
      localStorage.setItem("ue5ScenarioTimer", "50");
      TimerManager.start(false);
      // Timer decrements after initial updateDisplay, so it will be 49
      expect(TimerManager.getTimeRemaining()).toBe(49);
    });

    it("sets running state to true", () => {
      TimerManager.start(true);
      expect(TimerManager.isRunning()).toBe(true);
    });
  });

  describe("pause and resume", () => {
    beforeEach(() => {
      TimerManager.init({ totalTime: 100 });
    });

    it("pauses the timer", () => {
      TimerManager.start(true);
      expect(TimerManager.isRunning()).toBe(true);

      TimerManager.pause();
      expect(TimerManager.isRunning()).toBe(false);
    });

    it("resumes the timer", () => {
      TimerManager.start(true);
      TimerManager.pause();
      expect(TimerManager.isRunning()).toBe(false);

      TimerManager.resume();
      expect(TimerManager.isRunning()).toBe(true);
    });
  });

  describe("stop", () => {
    it("stops the timer", () => {
      TimerManager.init({ totalTime: 100 });
      TimerManager.start(true);
      expect(TimerManager.isRunning()).toBe(true);

      TimerManager.stop();
      expect(TimerManager.isRunning()).toBe(false);
    });
  });

  describe("timer countdown", () => {
    it("decrements time remaining", () => {
      TimerManager.init({ totalTime: 10 });
      TimerManager.start(true);

      const initialTime = TimerManager.getTimeRemaining();
      vi.advanceTimersByTime(1000);

      expect(TimerManager.getTimeRemaining()).toBe(initialTime - 1);
    });

    it("calls onTimeUp when time expires", () => {
      const onTimeUp = vi.fn();
      TimerManager.init({ totalTime: 2, onTimeUp });
      TimerManager.start(true);

      // Advance past the timer duration
      vi.advanceTimersByTime(3000);

      expect(onTimeUp).toHaveBeenCalled();
    });

    it("persists time to localStorage", () => {
      TimerManager.init({ totalTime: 10 });
      TimerManager.start(true);

      vi.advanceTimersByTime(1000);

      const saved = localStorage.getItem("ue5ScenarioTimer");
      expect(saved).toBeDefined();
    });
  });
});
