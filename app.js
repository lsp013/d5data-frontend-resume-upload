/* Resume upload card — interaction layer.
 *
 * Kept dependency-free (plain DOM API) so the page can be opened from disk or
 * served by any static host without a build step.
 */

(function () {
  "use strict";

  var dropzone = document.getElementById("dropzone");
  var input = document.getElementById("resume-input");
  var status = document.getElementById("file-status");
  var nameEl = document.getElementById("file-name");
  var clearBtn = document.getElementById("file-clear");
  var finishBtn = document.getElementById("finish");
  var lastStepBtn = document.getElementById("last-step");
  var note = document.getElementById("actions-note");
  var stepperEl = document.getElementById("stepper");
  var steps = Array.prototype.slice.call(
    document.querySelectorAll(".stepper__step")
  );
  var rails = Array.prototype.slice.call(
    document.querySelectorAll(".stepper__rail")
  );

  if (!dropzone || !input) {
    return;
  }

  var selectedFile = null;
  var step = 1; /* 1 = start, 2 = file chosen, 3 = finished */

  /* --- progress stepper -------------------------------------------------- */
  function renderStep() {
    steps.forEach(function (el, index) {
      var number = index + 1;
      var isCurrent = number === step;
      el.classList.toggle("is-done", number < step);
      el.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        el.setAttribute("aria-current", "step");
      } else {
        el.removeAttribute("aria-current");
      }
    });

    /* rails[index] is the segment between step index+1 and index+2 */
    rails.forEach(function (el, index) {
      el.classList.toggle("is-done", step > index + 1);
    });

    if (stepperEl) {
      stepperEl.setAttribute("aria-label", "Progress: step " + step + " of 3");
    }
    if (lastStepBtn) {
      lastStepBtn.disabled = step === 1;
    }
  }

  function goToStep(next) {
    step = Math.min(3, Math.max(1, next));
    renderStep();
  }

  function setNote(message, tone) {
    note.textContent = message || "";
    note.classList.toggle("is-error", tone === "error");
    note.classList.toggle("is-success", tone === "success");
  }

  function showFile(file) {
    selectedFile = file;
    nameEl.textContent = file.name + " · " + formatSize(file.size);
    status.classList.add("is-visible");
    setNote("", null);
    goToStep(2);
  }

  function clearFile() {
    selectedFile = null;
    input.value = "";
    nameEl.textContent = "";
    status.classList.remove("is-visible");
    setNote("", null);
    goToStep(1);
  }

  function formatSize(bytes) {
    if (bytes < 1024) {
      return bytes + " B";
    }
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function pickFromInput(event) {
    var file = event.target.files && event.target.files[0];
    if (file) {
      showFile(file);
    }
  }

  function pickFromDrop(event) {
    event.preventDefault();
    dropzone.classList.remove("is-dragover");
    var file = event.dataTransfer && event.dataTransfer.files
      ? event.dataTransfer.files[0]
      : null;
    if (file) {
      showFile(file);
    }
  }

  /* --- open the native file dialog ------------------------------------- */
  dropzone.addEventListener("click", function () {
    input.click();
  });

  input.addEventListener("change", pickFromInput);

  /* --- drag & drop ------------------------------------------------------ */
  ["dragenter", "dragover"].forEach(function (type) {
    dropzone.addEventListener(type, function (event) {
      event.preventDefault();
      dropzone.classList.add("is-dragover");
    });
  });

  ["dragleave", "dragend"].forEach(function (type) {
    dropzone.addEventListener(type, function () {
      dropzone.classList.remove("is-dragover");
    });
  });

  dropzone.addEventListener("drop", pickFromDrop);

  /* a drop anywhere else must not replace the page */
  ["dragover", "drop"].forEach(function (type) {
    document.addEventListener(type, function (event) {
      event.preventDefault();
    });
  });

  /* --- remove the picked file ------------------------------------------- */
  clearBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    clearFile();
  });

  /* --- buttons ---------------------------------------------------------- */
  finishBtn.addEventListener("click", function () {
    if (!selectedFile) {
      setNote("Please choose a resume file first.", "error");
      dropzone.focus();
      return;
    }
    if (step === 3) {
      setNote(
        "Already finished — " + selectedFile.name + " is ready for parsing.",
        "success"
      );
      return;
    }
    setNote("Uploading " + selectedFile.name + " …", null);
    finishBtn.disabled = true;
    window.setTimeout(function () {
      finishBtn.disabled = false;
      goToStep(3);
      setNote("Done — " + selectedFile.name + " is ready for parsing.", "success");
    }, 700);
  });

  lastStepBtn.addEventListener("click", function () {
    if (step === 3) {
      goToStep(2);
      setNote("Back to the upload step. Choose Finish again when you are ready.", null);
      return;
    }
    if (step === 2) {
      clearFile();
      setNote("Back to the first step. The file selection was cleared.", null);
    }
  });

  renderStep();
})();
