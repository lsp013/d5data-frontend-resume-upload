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

  if (!dropzone || !input) {
    return;
  }

  var selectedFile = null;

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
  }

  function clearFile() {
    selectedFile = null;
    input.value = "";
    nameEl.textContent = "";
    status.classList.remove("is-visible");
    setNote("", null);
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
    setNote("Uploading " + selectedFile.name + " …", null);
    finishBtn.disabled = true;
    window.setTimeout(function () {
      finishBtn.disabled = false;
      setNote("Done — " + selectedFile.name + " is ready for parsing.", "success");
    }, 700);
  });

  lastStepBtn.addEventListener("click", function () {
    clearFile();
    setNote("Back to the previous step. No file was uploaded.", null);
  });
})();
