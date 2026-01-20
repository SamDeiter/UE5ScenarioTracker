/**
 * LMS Reporter - Unified API for SCORM 1.2 and xAPI
 * Auto-detects available protocol and provides single interface
 */

const LMSReporter = (function () {
  // Detected protocol: 'scorm12', 'xapi', or 'none'
  let protocol = "none";
  let initialized = false;

  /**
   * Initialize LMS connection
   * Auto-detects SCORM 1.2 or xAPI availability
   */
  function init() {
    if (initialized) return protocol;

    // Try SCORM 1.2 first (check for API object)
    if (detectSCORM12()) {
      protocol = "scorm12";
      console.log("[LMSReporter] Using SCORM 1.2");
    }
    // Try xAPI
    else if (typeof XAPIHelper !== "undefined" && XAPIHelper.init()) {
      protocol = "xapi";
      console.log("[LMSReporter] Using xAPI");
    }
    // No LMS available
    else {
      protocol = "none";
      console.log("[LMSReporter] No LMS detected - running standalone");
    }

    initialized = true;
    return protocol;
  }

  /**
   * Detect if SCORM 1.2 API is available
   */
  function detectSCORM12() {
    try {
      let win = window;
      let hops = 0;
      const maxHops = 20;

      while (win && hops++ < maxHops) {
        if (win.API) return true;
        if (win.parent && win.parent !== win) {
          win = win.parent;
        } else if (win.opener) {
          win = win.opener;
        } else {
          break;
        }
      }
    } catch (e) {
      // Cross-origin frame access blocked
    }
    return false;
  }

  /**
   * Get currently active protocol
   */
  function getProtocol() {
    return protocol;
  }

  /**
   * Check if an LMS is available
   */
  function isAvailable() {
    return protocol !== "none";
  }

  /**
   * Report scenario started
   */
  function started(scenarioId, scenarioTitle) {
    if (protocol === "xapi") {
      return XAPIHelper.started(scenarioId, scenarioTitle);
    }
    // SCORM 1.2 doesn't have a "started" event - just track locally
    console.log("[LMSReporter] Scenario started:", scenarioId);
    return Promise.resolve(true);
  }

  /**
   * Report step answered
   */
  function answered(scenarioId, stepId, choiceText, isCorrect, skill) {
    if (protocol === "xapi") {
      return XAPIHelper.answered(
        scenarioId,
        stepId,
        choiceText,
        isCorrect,
        skill,
      );
    }
    // SCORM 1.2 doesn't track individual answers by default
    console.log("[LMSReporter] Step answered:", stepId, isCorrect);
    return Promise.resolve(true);
  }

  /**
   * Report scenario completed with score
   * This is the main reporting call for both protocols
   */
  function completed(options) {
    const {
      scenarioId,
      scenarioTitle,
      score,
      passed,
      duration,
      guidToken,
      maxScore = 100,
      passMark = 80,
    } = options;

    if (protocol === "scorm12") {
      // Use existing SCORM 1.2 helper
      if (typeof reportScoreAndGUIDToLMS12 === "function") {
        const success = reportScoreAndGUIDToLMS12(
          score,
          guidToken,
          maxScore,
          passMark,
        );
        return Promise.resolve(success);
      }
    } else if (protocol === "xapi") {
      return XAPIHelper.completed(
        scenarioId,
        scenarioTitle,
        score,
        passed,
        duration,
      );
    }

    console.log("[LMSReporter] Completed:", scenarioId, "Score:", score);
    return Promise.resolve(true);
  }

  /**
   * Report final session completion (all scenarios done)
   */
  function sessionComplete(totalScore, passed, guidToken) {
    if (protocol === "scorm12") {
      if (typeof reportScoreAndGUIDToLMS12 === "function") {
        return Promise.resolve(
          reportScoreAndGUIDToLMS12(totalScore, guidToken),
        );
      }
    } else if (protocol === "xapi") {
      return XAPIHelper.sendStatement({
        verb: {
          id: "http://adlnet.gov/expapi/verbs/passed",
          display: { "en-US": passed ? "passed" : "failed" },
        },
        object: {
          id: window.location.origin + window.location.pathname,
          definition: {
            name: { "en-US": "UE5 Scenario Tracker" },
            type: "http://adlnet.gov/expapi/activities/course",
          },
          objectType: "Activity",
        },
        result: {
          score: {
            scaled: totalScore / 100,
            raw: totalScore,
            max: 100,
            min: 0,
          },
          success: passed,
          completion: true,
        },
      });
    }

    console.log("[LMSReporter] Session complete:", totalScore);
    return Promise.resolve(true);
  }

  // Public API
  return {
    init,
    getProtocol,
    isAvailable,
    started,
    answered,
    completed,
    sessionComplete,
  };
})();

// Export for use in other modules
window.LMSReporter = LMSReporter;
