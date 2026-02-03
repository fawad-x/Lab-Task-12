document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("complaintForm");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Stop form from refreshing page
            
            // First validate form
            if (!validateForm()) {
                return false;
            }
            
            // Show loading message
            document.getElementById("result").innerHTML = 
                '<div style="background-color: #e3f2fd; color: #1565c0; padding: 10px; margin: 10px 0; border-radius: 4px;">' +
                'Submitting complaint... Please wait.' +
                '</div>';
            
            // Get form data
            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            
            // Send data to server
            fetch('/submit-complaint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    // Show success message
                    document.getElementById("result").innerHTML = 
                        '<div style="background-color: #e8f5e9; color: #2e7d32; padding: 15px; border: 1px solid #81c784; margin: 10px 0; border-radius: 4px;">' +
                        '<h3 style="margin-top:0;">✅ Complaint Submitted Successfully!</h3>' +
                        '<p><strong>Your Complaint ID:</strong> <span style="font-size: 18px; font-weight: bold;">' + result.complaintId + '</span></p>' +
                        '<p>Please save this ID to track your complaint status.</p>' +
                        '<p>You can track your complaint <a href="/track">here</a>.</p>' +
                        '</div>';
                    
                    // Reset form
                    form.reset();
                    
                    // Auto scroll to result
                    document.getElementById("result").scrollIntoView({ behavior: 'smooth' });
                    
                } else {
                    // Show error from server
                    showError("Server error: " + (result.error || "Unknown error"));
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showError("Failed to submit complaint. Please try again.");
            });
            
            return false;
        });
    }
});

// Function to show error (same as in validation.js)
function showError(message) {
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = 
        '<div style="background-color: #ffebee; color: #c62828; padding: 10px; border: 1px solid #ef9a9a; margin: 10px 0; border-radius: 4px;">' +
        '<strong>Error:</strong> ' + message +
        '</div>';
}