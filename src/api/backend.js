// src/lib/backend.js
console.log(process.env.NOCODB_API_URL
);

export async function getTasks() {
    const endpoint = `${process.env.NOCODB_API_URL}m30i06j9zqwfpyw/records?offset=0&limit=25&where=&viewId=vwpscq4rfogu9ueu`;
  const res = await fetch(
    endpoint,
    {
      headers: {
        accept: "application/json",
        "xc-token": process.env.NOCODB_API_KEY,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
    // console.log(res);

  const data = await res.json();
    console.log(data.list);
  return data.list; // Only return the relevant array
}

// POST: Add a new task
export async function createTask(taskData, id) {
  const endpoint1 = `https://app.nocodb.com/api/v2/tables/m30i06j9zqwfpyw/records`;
  // console.log(endpoint1);

    const fullData = {
      ...taskData,
      Assignments: [id], // assuming it's a many-to-one or many-to-many relation
    };

  const response = await fetch(endpoint1, {
    method: "POST",
    headers: {
      "xc-token": 'zMkfXoaR-3iwO5mLIsZF4SGzMXVM9w_dFUJcC3tt',
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fullData),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

// PATCH: Update an existing task
export async function updateTask(id, updatedData) {
  const endpoint = `https://app.nocodb.com/api/v2/tables/m30i06j9zqwfpyw/records`;
  console.log(endpoint);
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "xc-token": "zMkfXoaR-3iwO5mLIsZF4SGzMXVM9w_dFUJcC3tt",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}


export async function getAssignments() {
  const assignments_endpoint = `${process.env.NOCODB_API_URL}m8u2ljy266xokmx/records?offset=0&limit=25&where=&viewId=vwhbkk58ieyry0ix`;
//   console.log(endpoint)
  const assignments = await fetch(assignments_endpoint, {
    method: "GET",
    headers: {
      accept: "application/json",
      "xc-token": process.env.NOCODB_API_KEY,
    },
  });

  if (!assignments.ok) {
    throw new Error("Failed to fetch assignments");
  }

  const attachments_endpoint = `${process.env.NOCODB_API_URL}m7m9z5i52gme9wf/records?offset=0&limit=25&where=&viewId=vwdy7eoxnrzip0w5`;
  const attachments = await fetch(attachments_endpoint, {
    method: "GET",
    headers: {
      accept: "application/json",
      "xc-token": process.env.NOCODB_API_KEY,
    },
  });
  // console.log(res);
    if (!attachments.ok) {
      throw new Error("Failed to fetch attachments");
    }

      const tasks_endpoint = `${process.env.NOCODB_API_URL}m30i06j9zqwfpyw/records?offset=0&limit=25&where=&viewId=vwpscq4rfogu9ueu`;
      const tasks = await fetch(tasks_endpoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          "xc-token": process.env.NOCODB_API_KEY,
        },
      });
      // console.log(res);
      if (!tasks.ok) {
        throw new Error("Failed to fetch attachments");
      }

  let assignments_data = await assignments.json();
  assignments_data = assignments_data.list;
  let attachments_data = await attachments.json();
    attachments_data = attachments_data.list;
  let tasks_data = await tasks.json();
    tasks_data = tasks_data.list;
    const attachmentMap = {};
    const taskMap = {};


    if(tasks_data.length>0){
      tasks_data.forEach((task) => {
        const assignmentId = task.Assignments?.Id;
        if (!taskMap[assignmentId]) {
          taskMap[assignmentId] = [];
        }
        taskMap[assignmentId].push(task);
      });
    }

    for (const item of attachments_data) {
      const assignmentId = item.Assignments?.Id;
      const files = item.Attachment || [];

      if (!assignmentId || files.length === 0) continue;

      if (!attachmentMap[assignmentId]) {
        attachmentMap[assignmentId] = [];
      }

      attachmentMap[assignmentId].push(...files); // spread because it's an array
    }
    

    const enrichedAssignments = assignments_data.map((assignment) => {
      return {
        ...assignment,
        attachments: attachmentMap[assignment.Id] || [],
        Tasks: taskMap[assignment.Id] || [],
      };
    });
  console.log(enrichedAssignments);
  return enrichedAssignments; // Only return the relevant array
}

export async function uploadFile(file, assignmentId) {
  const formData = new FormData();

  // NocoDB requires the structure of the fields in the formData to match the schema
  formData.append("fields[Attachment]", file); // 'Attachment' is your file field name
  formData.append("fields[Assignments]", assignmentId); // Assuming this links to assignment

  const endpoint = `https://app.nocodb.com/api/v2/tables/m7m9z5i52gme9wf/records`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "xc-token": "zMkfXoaR-3iwO5mLIsZF4SGzMXVM9w_dFUJcC3tt",
      // Do NOT manually set 'Content-Type', the browser will set it correctly for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload file: ${error}`);
  }

  return response.json();
}
