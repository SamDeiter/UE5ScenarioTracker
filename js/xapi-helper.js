/**
 * xAPI (Tin Can) Helper
 * Sends xAPI statements to a Learning Record Store (LRS)
 */

const XAPIHelper = (function () {
  // Configuration - populated from launch parameters or config
  let config = {
    endpoint: null,
    auth: null,
    actor: null,
    registration: null,
    activityId: null,
  };

  /**
   * Initialize xAPI from launch parameters
   * Looks for tincan.xml launch data or URL parameters
   */
  function init() {
    // Try to get from URL parameters (common xAPI launch method)
    const params = new URLSearchParams(window.location.search);

    config.endpoint = params.get("endpoint") || window.xAPIEndpoint || null;
    config.auth = params.get("auth") || window.xAPIAuth || null;
    config.registration = params.get("registration") || generateUUID();
    config.activityId =
      params.get("activity_id") ||
      window.location.origin + window.location.pathname;

    // Try to parse actor from params
    const actorParam = params.get("actor");
    if (actorParam) {
      try {
        config.actor = JSON.parse(decodeURIComponent(actorParam));
      } catch (e) {
        console.warn("[xAPI] Could not parse actor parameter");
      }
    }

    // Default actor if not provided
    if (!config.actor) {
      config.actor = {
        mbox: "mailto:anonymous@example.com",
        name: "Anonymous Learner",
        objectType: "Agent",
      };
    }

    console.log("[xAPI] Initialized:", config.endpoint ? "✓" : "✗ No endpoint");
    return isAvailable();
  }

  /**
   * Check if xAPI is available (has endpoint configured)
   */
  function isAvailable() {
    return !!(config.endpoint && config.auth);
  }

  /**
   * Generate a UUID v4
   */
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  /**
   * Send an xAPI statement
   * @param {Object} statement - The xAPI statement
   * @returns {Promise<boolean>} - Success/failure
   */
  async function sendStatement(statement) {
    if (!isAvailable()) {
      console.warn("[xAPI] Cannot send statement - not configured");
      return false;
    }

    // Add required fields
    statement.id = statement.id || generateUUID();
    statement.timestamp = statement.timestamp || new Date().toISOString();
    statement.actor = statement.actor || config.actor;

    if (config.registration) {
      statement.context = statement.context || {};
      statement.context.registration = config.registration;
    }

    try {
      const response = await fetch(config.endpoint + "statements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: config.auth,
          "X-Experience-API-Version": "1.0.3",
        },
        body: JSON.stringify(statement),
      });

      if (response.ok) {
        console.log("[xAPI] Statement sent:", statement.verb?.id);
        return true;
      } else {
        console.error("[xAPI] Statement failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("[xAPI] Network error:", error);
      return false;
    }
  }

  // ========== Statement Templates ==========

  /**
   * Report that a scenario was started
   */
  function started(scenarioId, scenarioTitle) {
    return sendStatement({
      verb: {
        id: "http://adlnet.gov/expapi/verbs/launched",
        display: { "en-US": "launched" },
      },
      object: {
        id: config.activityId + "/scenario/" + scenarioId,
        definition: {
          name: { "en-US": scenarioTitle || scenarioId },
          type: "http://adlnet.gov/expapi/activities/simulation",
        },
        objectType: "Activity",
      },
    });
  }

  /**
   * Report that a step was answered
   */
  function answered(scenarioId, stepId, choiceText, isCorrect, skill) {
    return sendStatement({
      verb: {
        id: "http://adlnet.gov/expapi/verbs/answered",
        display: { "en-US": "answered" },
      },
      object: {
        id: config.activityId + "/scenario/" + scenarioId + "/step/" + stepId,
        definition: {
          name: { "en-US": stepId },
          type: "http://adlnet.gov/expapi/activities/cmi.interaction",
        },
        objectType: "Activity",
      },
      result: {
        success: isCorrect,
        response: choiceText,
      },
      context: {
        extensions: {
          "http://id.tincanapi.com/extension/skill": skill || "general",
        },
      },
    });
  }

  /**
   * Report that a scenario was completed
   */
  function completed(scenarioId, scenarioTitle, score, passed, duration) {
    return sendStatement({
      verb: {
        id: "http://adlnet.gov/expapi/verbs/completed",
        display: { "en-US": "completed" },
      },
      object: {
        id: config.activityId + "/scenario/" + scenarioId,
        definition: {
          name: { "en-US": scenarioTitle || scenarioId },
          type: "http://adlnet.gov/expapi/activities/simulation",
        },
        objectType: "Activity",
      },
      result: {
        score: {
          scaled: score / 100,
          raw: score,
          max: 100,
          min: 0,
        },
        success: passed,
        completion: true,
        duration: duration ? formatDuration(duration) : undefined,
      },
    });
  }

  /**
   * Format duration in ISO 8601 format (PT#H#M#S)
   */
  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let duration = "PT";
    if (hours > 0) duration += hours + "H";
    if (minutes > 0) duration += minutes + "M";
    if (secs > 0 || duration === "PT") duration += secs + "S";

    return duration;
  }

  /**
   * Configure xAPI manually (for testing or non-launch scenarios)
   */
  function configure(options) {
    Object.assign(config, options);
  }

  // Public API
  return {
    init,
    isAvailable,
    configure,
    sendStatement,
    started,
    answered,
    completed,
  };
})();

// Export for use in other modules
window.XAPIHelper = XAPIHelper;
