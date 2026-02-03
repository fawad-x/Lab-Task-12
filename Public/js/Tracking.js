function trackComplaint() {
    var id = document.getElementById("trackId").value;
    
    if (!id) {
        alert("Please enter Complaint ID");
        return;
    }
    
    fetch('/get-complaint/' + id)
        .then(response => response.json())
        .then(complaint => {
            var detailsDiv = document.getElementById("complaintDetails");
            
            if (complaint) {
                var statusColor = "orange";
                if (complaint.status === "Resolved") statusColor = "green";
                if (complaint.status === "In Progress") statusColor = "blue";
                
                detailsDiv.innerHTML = 
                    '<div class="complaint-box">' +
                    '<h3>Complaint #' + complaint.id + '</h3>' +
                    '<p><strong>Name:</strong> ' + complaint.name + '</p>' +
                    '<p><strong>Phone:</strong> ' + complaint.phone + '</p>' +
                    '<p><strong>Address:</strong> ' + complaint.location + '</p>' +
                    '<p><strong>Problem:</strong> ' + complaint.problem + '</p>' +
                    '<p><strong>Status:</strong> <span style="color: ' + statusColor + '; font-weight: bold;">' + complaint.status + '</span></p>' +
                    '<p><strong>Submitted on:</strong> ' + complaint.created_at + '</p>' +
                    '</div>';
            } else {
                detailsDiv.innerHTML = '<p style="color: red;">Complaint not found!</p>';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to fetch complaint details");
        });
}