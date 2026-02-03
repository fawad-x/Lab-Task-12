// Load all complaints
function loadComplaints() {
    fetch('/get-all-complaints')
        .then(response => response.json())
        .then(complaints => {
            var listDiv = document.getElementById("complaintsList");
            listDiv.innerHTML = "";
            
            if (complaints.length === 0) {
                listDiv.innerHTML = "<p>No complaints submitted yet.</p>";
                return;
            }
            
            // Create table for complaints
            var table = '<table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">';
            table += '<tr style="background-color: #4CAF50; color: white;">';
            table += '<th>ID</th><th>Name</th><th>Phone</th><th>Location</th><th>Problem</th><th>Status</th><th>Date</th><th>Action</th>';
            table += '</tr>';
            
            complaints.forEach(function(complaint) {
                // Status color
                var statusColor = "orange";
                if (complaint.status === "Resolved") statusColor = "green";
                if (complaint.status === "In Progress") statusColor = "blue";
                
                table += '<tr>';
                table += '<td>' + complaint.id + '</td>';
                table += '<td>' + complaint.name + '</td>';
                table += '<td>' + complaint.phone + '</td>';
                table += '<td>' + complaint.location + '</td>';
                table += '<td>' + complaint.problem.substring(0, 50) + '...</td>';
                table += '<td><span style="color:' + statusColor + '">' + complaint.status + '</span></td>';
                table += '<td>' + complaint.created_at + '</td>';
                table += '<td>';
                table += '<select onchange="updateStatus(' + complaint.id + ', this.value)" style="padding: 5px;">';
                table += '<option value="Pending" ' + (complaint.status === "Pending" ? "selected" : "") + '>Pending</option>';
                table += '<option value="In Progress" ' + (complaint.status === "In Progress" ? "selected" : "") + '>In Progress</option>';
                table += '<option value="Resolved" ' + (complaint.status === "Resolved" ? "selected" : "") + '>Resolved</option>';
                table += '</select>';
                table += '</td>';
                table += '</tr>';
            });
            
            table += '</table>';
            listDiv.innerHTML = table;
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("complaintsList").innerHTML = 
                '<p style="color: red;">Error loading complaints. Please try again.</p>';
        });
}

// Update complaint status
function updateStatus(id, status) {
    if (!confirm("Change status of Complaint #" + id + " to '" + status + "'?")) {
        return;
    }
    
    fetch('/update-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            status: status
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("Status updated successfully!");
            loadComplaints(); // Refresh the list
        } else {
            alert("Failed to update status");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error updating status");
    });
}