document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#liberation-form");
  const tempButton = form.querySelector("button[type='button']");
  const permButton = form.querySelector("button[type='submit']");

  const getFormData = () => {
    const studentId = form.rm.value;
    const lunchDate = form.lunch.value;
    const dinnerDate = form.dinner.value;
    const justification = form.justification.value;
    const repeat = form.repeat.checked; 

    const meals = [];
    const mealDates = {};

    if (lunchDate) {
      meals.push("lunch");
      mealDates["lunch"] = lunchDate;
    }

    if (dinnerDate) {
      meals.push("dinner");
      mealDates["dinner"] = dinnerDate;
    }

    return {
      studentId,
      mealDates,
      meals,
      justification,
      repeat,
    };
  };

  const sendLiberationRequest = async (permissionType, data) => {
    try {
      const requestBody = {
        rm: data.studentId,
        lunch: data.mealDates["lunch"] || null,
        dinner: data.mealDates["dinner"] || null,
        justification: data.justification,
        option: permissionType === "temporary" ? "temporary" : "permanent",
        repeat: data.repeat
      };
      console.log(requestBody);
      const response = await fetch("/studentLiberation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      alert(result.message || "Liberation request sent.");
    } catch (error) {
      console.error(error);
      alert("Error sending liberation request.");
    }
  };

  // Temporary permission (via button)
  tempButton.addEventListener("click", () => {
    const data = getFormData();
    if (data.meals.length === 0) {
      alert("Please select at least one meal.");
      return;
    }
    sendLiberationRequest("temporary", data);
  });

  // Permanent permission (via submit)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getFormData();
    if (data.meals.length === 0) {
      alert("Please select at least one meal.");
      return;
    }
    sendLiberationRequest("permanent", data);
  });
});
