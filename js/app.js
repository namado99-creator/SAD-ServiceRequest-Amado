let requests = [];
let editingId = null;


// ===============================
// CHECK LOGGED-IN USER
// ===============================
async function checkUser() {

    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "login.html";
        return null;
    }

    return data.user;
}


// ===============================
// LOAD REQUESTS
// ===============================
async function loadRequests() {

    const user = await checkUser();

    if (!user) return;

    const { data, error } = await supabaseClient
    .from("service_requests")
    .select("*")
    .order("id", { ascending: true });

    if (error) {

        console.error("Load error:", error);

        alert("Error loading requests: " + error.message);

        return;
    }

    requests = data || [];

    displayRequests(requests);

    updateDashboard(requests);
}


// ===============================
// DISPLAY REQUESTS
// ===============================
function displayRequests(data) {

    const tableBody =
        document.getElementById("requestTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    No service requests found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(request => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${request.id}</td>

            <td>${escapeHTML(request.requester_name)}</td>

            <td>${escapeHTML(request.department)}</td>

            <td>${escapeHTML(request.category)}</td>

            <td>${escapeHTML(request.description)}</td>

            <td>${escapeHTML(request.priority)}</td>

            <td>${escapeHTML(request.status)}</td>

            <td>
                ${new Date(request.created_at).toLocaleString()}
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editRequest(${request.id})">
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteRequest(${request.id})">
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });
}


// ===============================
// ADD / UPDATE REQUEST
// ===============================
const requestForm = document.getElementById("requestForm");

if (requestForm) {

    requestForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const user = await checkUser();

        if (!user) return;


        // Get form values
        const requesterName =
            document.getElementById("requesterName").value.trim();

        const department =
            document.getElementById("department").value.trim();

        const category =
            document.getElementById("category").value;

        const description =
            document.getElementById("description").value.trim();

        const priority =
            document.getElementById("priority").value;

        const statusElement =
            document.getElementById("status");

        const status =
            statusElement ? statusElement.value : "Pending";


        // Validation
        if (
            !requesterName ||
            !department ||
            !category ||
            !description ||
            !priority
        ) {

            showFormMessage(
                "Please complete all required fields."
            );

            return;
        }


        // Data to save
        const requestData = {

            requester_name: requesterName,

            department: department,

            category: category,

            description: description,

            priority: priority
        };


        let result;


        // ===============================
        // UPDATE
        // ===============================
        if (editingId !== null) {

            requestData.status = status;

            result = await supabaseClient
                .from("service_requests")
                .update(requestData)
                .eq("id", editingId)
                .select();

        }


        // ===============================
        // INSERT
        // ===============================
        else {

            requestData.status = "Pending";

            // VERY IMPORTANT:
            // Connect request to logged-in user
            requestData.user_id = user.id;

            result = await supabaseClient
                .from("service_requests")
                .insert([requestData])
                .select();

        }


        // ===============================
        // CHECK DATABASE ERROR
        // ===============================
        if (result.error) {

            console.error(
                "Supabase error:",
                result.error
            );

            showFormMessage(
                "Error: " + result.error.message
            );

            return;
        }


        // Success message
        showFormMessage(
            editingId !== null
                ? "Request updated successfully!"
                : "Request added successfully!"
        );


        // Reset form
        resetForm();


        // Reload records
        await loadRequests();

    });
}


// ===============================
// EDIT REQUEST
// ===============================
async function editRequest(id) {

    const request = requests.find(
        item => item.id === id
    );

    if (!request) {

        alert("Request not found.");

        return;
    }


    editingId = id;


    document.getElementById("requestId").value =
        request.id;

    document.getElementById("requesterName").value =
        request.requester_name;

    document.getElementById("department").value =
        request.department;

    document.getElementById("category").value =
        request.category;

    document.getElementById("description").value =
        request.description;

    document.getElementById("priority").value =
        request.priority;

    document.getElementById("status").value =
        request.status;


    document.getElementById("formTitle").textContent =
        "Edit Service Request";

    document.getElementById("saveBtn").textContent =
        "Update Request";

    document.getElementById("cancelBtn").style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// DELETE REQUEST
// ===============================
async function deleteRequest(id) {

    const user = await checkUser();

    if (!user) return;


    const confirmed = confirm(
        "Are you sure you want to delete this request?"
    );

    if (!confirmed) return;


    const { error } = await supabaseClient
        .from("service_requests")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Error deleting request: " +
            error.message
        );

        return;
    }


    alert("Request deleted successfully.");


    await loadRequests();
}


// ===============================
// CANCEL EDIT
// ===============================
const cancelBtn =
    document.getElementById("cancelBtn");

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function() {

            resetForm();

        }
    );
}


// ===============================
// RESET FORM
// ===============================
function resetForm() {

    editingId = null;


    const form =
        document.getElementById("requestForm");

    if (form) {
        form.reset();
    }


    document.getElementById("formTitle").textContent =
        "Add Service Request";

    document.getElementById("saveBtn").textContent =
        "Add Request";

    document.getElementById("cancelBtn").style.display =
        "none";


    const requestId =
        document.getElementById("requestId");

    if (requestId) {
        requestId.value = "";
    }
}


// ===============================
// SEARCH AND FILTER
// ===============================
function filterRequests() {

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const priorityFilter =
        document.getElementById("priorityFilter");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "";


    const priority =
        priorityFilter
            ? priorityFilter.value
            : "";


    const filtered =
        requests.filter(request => {

            const requesterName =
                (request.requester_name || "")
                    .toLowerCase();

            const description =
                (request.description || "")
                    .toLowerCase();


            const matchesSearch =
                requesterName.includes(search) ||
                description.includes(search);


            const matchesStatus =
                !status ||
                request.status === status;


            const matchesPriority =
                !priority ||
                request.priority === priority;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });


    displayRequests(filtered);
}


// Search
const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterRequests
    );
}


// Status filter
const statusFilter =
    document.getElementById("statusFilter");

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterRequests
    );
}


// Priority filter
const priorityFilter =
    document.getElementById("priorityFilter");

if (priorityFilter) {

    priorityFilter.addEventListener(
        "change",
        filterRequests
    );
}


// ===============================
// DASHBOARD
// ===============================
function updateDashboard(data) {

    const total =
        data.length;


    const pending =
        data.filter(
            request =>
                request.status === "Pending"
        ).length;


    const progress =
        data.filter(
            request =>
                request.status === "In Progress"
        ).length;


    const completed =
        data.filter(
            request =>
                request.status === "Completed"
        ).length;


    document.getElementById("totalCount").textContent =
        total;

    document.getElementById("pendingCount").textContent =
        pending;

    document.getElementById("progressCount").textContent =
        progress;

    document.getElementById("completedCount").textContent =
        completed;
}


// ===============================
// LOGOUT
// ===============================
const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function() {

            const { error } =
                await supabaseClient.auth.signOut();


            if (error) {

                alert(
                    "Logout failed: " +
                    error.message
                );

                return;
            }


            window.location.href =
                "login.html";

        }
    );
}


// ===============================
// FORM MESSAGE
// ===============================
function showFormMessage(message) {

    const element =
        document.getElementById("formMessage");

    if (element) {

        element.textContent = message;

    } else {

        alert(message);

    }
}


// ===============================
// HTML ESCAPING
// ===============================
function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// ===============================
// START APPLICATION
// ===============================
loadRequests();