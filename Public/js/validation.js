// Validate form before submitting
function validateForm() {
    // Get form values
    var name = document.getElementsByName("name")[0].value.trim();
    var phone = document.getElementsByName("phone")[0].value.trim();
    var location = document.getElementsByName("location")[0].value.trim();
    var problem = document.getElementsByName("problem")[0].value.trim();
    
    // Reset error display
    document.getElementById("result").innerHTML = "";
    
    // Check if fields are empty
    if (name === "") {
        showError("Please enter your name");
        return false;
    }
    
    if (phone === "") {
        showError("Please enter phone number");
        return false;
    }
    
    if (location === "") {
        showError("Please enter your address");
        return false;
    }
    
    if (problem === "") {
        showError("Please describe the problem");
        return false;
    }
    
    // Check name length
    if (name.length < 3) {
        showError("Name should be at least 3 characters");
        return false;
    }
    
    // Check phone number (only numbers, 10-15 digits)
    var phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phone)) {
        showError("Phone number should be 10-15 digits only");
        return false;
    }
    
    // Check address length
    if (location.length < 5) {
        showError("Please enter complete address");
        return false;
    }
    
    // Check problem description length
    if (problem.length < 10) {
        showError("Please describe problem in at least 10 characters");
        return false;
    }
    
    // Check if problem is too short
    if (problem.length > 500) {
        showError("Problem description should not exceed 500 characters");
        return false;
    }
    
    return true;
}

// Show error message
function showError(message) {
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = 
        '<div style="background-color: #ffebee; color: #c62828; padding: 10px; border: 1px solid #ef9a9a; margin: 10px 0; border-radius: 4px;">' +
        '<strong>Error:</strong> ' + message +
        '</div>';
}

// Attach validation to form
document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("complaintForm");
    if (form) {
        form.addEventListener("submit", function(event) {
            if (!validateForm()) {
                event.preventDefault();
                return false;
            }
        });
    }
});